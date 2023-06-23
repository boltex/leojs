//@+leo-ver=5-thin
//@+node:felix.20210102012334.1: * @file src/core/leoApp.ts
//@+<< imports >>
//@+node:felix.20210102211149.1: ** << imports >>
import * as vscode from "vscode";
import * as Bowser from "bowser";
import * as os from "os";
import * as path from 'path';
import * as g from './leoGlobals';
import * as utils from "../utils";
import { NullGui } from "./leoGui";
import { NodeIndices, VNode, Position } from './leoNodes';
import { Commands } from './leoCommands';
import { FastRead, FileCommands } from "./leoFileCommands";
import { GlobalConfigManager, SettingsTreeParser } from "./leoConfig";
import { Constants } from "../constants";
import { ExternalFilesController } from "./leoExternalFiles";
import { LeoFrame } from "./leoFrame";
import { SettingsDict } from "./leoGlobals";
import { leojsSettingsXml } from "../leojsSettings";
import { LeoUI } from "../leoUI";

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
            return;  // For debugger.
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
                if (index > -1) { // only splice array when item is found
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
            this.on_idle,
            500,
            'IdleTimeManager.on_idle'
        );

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
    public structure_errors: number = 0; // Set by p.safeMoveToThreadNext.
    public statsDict: any = {}; // dict used by g.stat, g.clear_stats, g.print_stats.
    public statsLockout: boolean = false; // A lockout to prevent unbound recursion while gathering stats.
    public validate_outline: boolean = false; // True: enables c.validate_outline. (slow)

    //@-<< LeoApp: Debugging & statistics >>
    //@+<< LeoApp: error messages >>
    //@+node:felix.20210103024632.4: *5* << LeoApp: error messages >>
    public menuWarningsGiven: boolean = false; // True: suppress warnings in menu code.
    public unicodeErrorGiven: boolean = true; // True: suppress unicode trace-backs.

    //@-<< LeoApp: error messages >>
    //@+<< LeoApp: global directories >>
    //@+node:felix.20210103024632.5: *5* << LeoApp: global directories >>
    public extensionsDir: string | undefined; // The leo / extensions directory
    public globalConfigDir: string | undefined; // leo / config directory 
    public globalOpenDir: string | undefined; // The directory last used to open a file.
    public homeDir: string | undefined; // The user's home directory.
    public homeLeoDir: string | undefined; // The user's home/.leo directory.
    public testDir: string | undefined; // Used in unit tests
    public loadDir: string | undefined; // The leo / core directory.
    public machineDir: string | undefined; // The machine - specific directory.

    public vscodeWorkspaceUri: vscode.Uri | undefined;
    public vscodeUriAuthority: string = "";
    public vscodeUriPath: string = "";

    //@-<< LeoApp: global directories >>
    //@+<< LeoApp: global data >>
    //@+node:felix.20210103024632.6: *5* << LeoApp: global data >>
    public atAutoNames: string[] = []; // The set of all @auto spellings.
    public atFileNames: string[] = []; // The set of all built -in @<file>spellings.

    public vscodeUriScheme: string = ""; // * VSCODE WORKSPACE FILE SCHEME 
    public globalKillBuffer: any[] = []; // The global kill buffer.
    public globalRegisters: any = {}; // The global register list.
    public leoID: string = ''; // The id part of gnx's, using empty for falsy.
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
    public commander_cacher: any = null; // The singleton leoCacher.CommanderCacher instance.
    public commander_db: any = null; // The singleton db, managed by g.app.commander_cacher.
    public config!: GlobalConfigManager; // The singleton leoConfig instance.
    public db: any = undefined; // The singleton global db, managed by g.app.global_cacher.
    public externalFilesController!: ExternalFilesController; // The singleton ExternalFilesController instance.
    public global_cacher: any = null; // The singleton leoCacher.GlobalCacher instance.
    public idleTimeManager!: IdleTimeManager; // The singleton IdleTimeManager instance.
    public ipk: any = null; // python kernel instance
    public loadManager: LoadManager | undefined; // The singleton LoadManager instance.
    // public logManager: any = null;
    // The singleton LogManager instance.
    // public openWithManager: any = null;
    // The singleton OpenWithManager instance.
    public nodeIndices: NodeIndices | undefined; // The singleton nodeIndices instance.
    public pluginsController: any = null; // The singleton PluginsManager instance. public sessionManager: any = null; // The singleton SessionManager instance. // The Commands class...
    public commandName: any = null; // The name of the command being executed.
    public commandInterruptFlag: boolean = false; // True: command within a command.

    //@-<< LeoApp: global controller/manager objects >>
    //@+<< LeoApp: global reader/writer data >>
    //@+node:felix.20210103024632.8: *5* << LeoApp: global reader/writer data >>
    // From leoAtFile.py.
    public atAutoWritersDict: { [key: string]: any } = {};
    public writersDispatchDict: { [key: string]: any } = {};
    // From leoImport.py
    public atAutoDict: { [key: string]: any } = {};
    // Keys are @auto names, values are scanner classes.
    public classDispatchDict: { [key: string]: any } = {};

    // True if an @auto writer should write sentinels,
    // even if the external file doesn't actually contain sentinels.
    public force_at_auto_sentinels = false;

    // leo 5.6: allow undefined section references in all @auto files.
    // Leo 6.6.4: Make this a permanent g.app ivar.
    public allow_undefined_refs = false;
    //@-<< LeoApp: global reader/writer data >>
    //@+<< LeoApp: global status vars >>
    //@+node:felix.20210103024632.9: *5* << LeoApp: global status vars >>
    public already_open_files: any[] = []; // A list of file names that * might * be open in another copy of Leo.
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
    public hookFunction = null;
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
    public scriptResult = null;   // For use by leoPymacs.
    public permanentScriptDict = {};   // For use by scrips.Never cleared automatically.

    public isExternalUnitTest: boolean = false; // True: we are running a unit test externally.
    public runningAllUnitTests: boolean = false; // True: we are running all unit tests(Only for local tests).

    //@-<< LeoApp: scripting ivars >>
    //@+<< LeoApp: unit testing ivars >>
    //@+node:felix.20210103024632.15: *5* << LeoApp: unit testing ivars >>
    public suppressImportChecks: boolean = false;
    // Used only in basescanner.py ;
    // True: suppress importCommands.check
    public unitTestDict = {};   // For communication between unit tests and code.
    public unitTestGui = null;   // A way to override the gui in external unit tests.
    public unitTesting = false;   // True if unit testing.
    public unitTestMenusDict = {};   // Created in LeoMenu.createMenuEntries for a unit test. ;   // keys are command names.values are sets of strokes.

    //@-<< LeoApp: unit testing ivars >>

    public delegate_language_dict: { [key: string]: string } = {};
    public extension_dict: { [key: string]: string } = {};
    public extra_extension_dict: { [key: string]: string } = {};
    public prolog_prefix_string: string = "";
    public prolog_postfix_string: string = "";
    public prolog_namespace_string: string = "";
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
            // Values are existing languages in leo / modes.
            "less": "css",
            "hbs": "html",
            "handlebars": "html",
            //"rust": "c",
            // "vue": "c",
        };
    }

    //@+node:felix.20210103024632.17: *5* app.define_extension_dict
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

    //@+node:felix.20210103024632.18: *5* app.define_global_constants
    public define_global_constants(): void {
        // this.prolog_string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        this.prolog_prefix_string = "<?xml version=\"1.0\" encoding=";
        this.prolog_postfix_string = "?>";
        // this.prolog_namespace_string = 'xmlns:leo="http://edreamleo.org/namespaces/leo-python-editor/1.1"';
        this.prolog_namespace_string = 'xmlns:leo="https://leo-editor.github.io/leo-editor/namespaces/leo-python-editor/1.1"';
    }

    //@+node:felix.20210103024632.19: *5* app.define_language_delims_dict
    public define_language_delims_dict(): void {

        this.language_delims_dict = {
            // Internally, lower case is used for all language names.
            // Keys are languages, values are strings that contain 1, 2 or 3 delims separated by spaces.
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
            "cpp": "// /* */", // C++.
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

    //@+node:felix.20210103024632.20: *5* app.define_language_extension_dict
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

    //@+node:felix.20210103024632.21: *5* app.init_at_auto_names
    /**
     * Init the app.atAutoNames set.
     */
    public init_at_auto_names(): void {
        this.atAutoNames = ["@auto-rst", "@auto"];
    }

    //@+node:felix.20210103024632.22: *5* app.init_at_file_names
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

    //@-others

    //@+node:felix.20220417165216.1: *4* app.computeSignon & printSignon
    public computeSignon(): void {

        const app = this;
        if (app.signon && app.signon1) {
            return;
        }

        let guiVersion = 'VSCode version ' + vscode.version;

        const w_LeoJSExtension = vscode.extensions.getExtension(Constants.PUBLISHER + '.' + Constants.NAME)!;
        const w_leojsPackageJson = w_LeoJSExtension.packageJSON;

        const leoVer: string = w_leojsPackageJson.version;

        // n1, n2, n3, junk1, junk2 = sys.version_info
        let n1: string = "";
        if (process.version) {
            n1 = 'Node.js ' + process.version;
            // @ts-expect-error
        } else if (location.hostname) {
            // @ts-expect-error
            n1 = location.hostname;
            // if dots take 2 last parts
            if (n1.includes('.')) {
                let n1_split = n1.split('.');
                if (n1_split.length > 2) {
                    n1_split = n1_split.slice(-2);
                }
                n1 = n1_split.join(".");
            }

        }
        if (n1) {
            n1 += ', ';
        }

        let sysVersion: string = "Browser";

        if (process.platform) {
            sysVersion = process.platform;
        } else {
            let browserResult: any;
            // @ts-expect-error
            if (navigator.userAgent) {
                // @ts-expect-error
                browserResult = Bowser.parse(navigator.userAgent);
                sysVersion = browserResult.browser.name;
                if (browserResult.browser.version) {
                    sysVersion += " " + browserResult.browser.version;
                }

                if (browserResult.os) {
                    if (browserResult.os.name) {
                        sysVersion += " on " + browserResult.os.name;
                    }
                    if (browserResult.os.version) {
                        sysVersion += " " + browserResult.os.version;
                    }
                }
            }
        }
        // TODO: fleshout Windows info
        /*
        if sys.platform.startswith('win'):
            sysVersion = 'Windows '
            try:
                // peckj 20140416: determine true OS architecture
                // the following code should return the proper architecture
                // regardless of whether or not the python architecture matches
                // the OS architecture (i.e. python 32-bit on windows 64-bit will return 64-bit)
                v = platform.win32_ver()
                release, winbuild, sp, ptype = v
                true_platform = os.environ['PROCESSOR_ARCHITECTURE']
                try:
                    true_platform = os.environ['PROCESSOR_ARCHITEw6432']
                except KeyError:
                    pass
                sysVersion = f"Windows {release} {true_platform} (build {winbuild}) {sp}"
            except Exception:
                pass
        else: sysVersion = sys.platform 
        */

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
        g.es_print(app.signon);
        g.es_print(app.signon1);
    }
    //@+node:felix.20220417215228.1: *4* app.setLeoID & helpers
    /**
     * Get g.app.leoID from various sources.
     */
    public async setLeoID(useDialog: boolean = true, verbose: boolean = true): Promise<string> {
        this.leoID = "";

        // tslint:disable-next-line: strict-comparisons
        console.assert(this === g.app);

        verbose = verbose && !g.unitTesting && !this.silentMode;

        // if (g.unitTesting) {
        //     this.leoID = "unittestid";
        // }

        let w_userName = ""; // = "TestUserName";

        // 1 - set leoID from configuration settings
        if (!this.leoID && vscode && vscode.workspace) {
            w_userName = vscode.workspace.getConfiguration(
                Constants.CONFIG_NAME).get(
                    Constants.CONFIG_NAMES.LEO_ID,
                    Constants.CONFIG_DEFAULTS.LEO_ID
                );
            if (w_userName) {
                this.leoID = this.cleanLeoID(w_userName, 'config.leoID');
            }
        }

        // 2 - Set leoID from environment
        if (!this.leoID && os && os.userInfo) {
            w_userName = os.userInfo().username;
            if (w_userName) {
                this.leoID = this.cleanLeoID(w_userName, 'os.userInfo().username');
            }
        }

        // 3 - Set leoID from user dialog if allowed
        if (!this.leoID && useDialog) {
            const w_id = await utils.getIdFromDialog();
            this.leoID = this.cleanLeoID(w_id, '');
            if (this.leoID && vscode && vscode.workspace) {
                const w_vscodeConfig = vscode.workspace.getConfiguration(Constants.CONFIG_NAME);
                // tslint:disable-next-line: strict-comparisons
                if (w_vscodeConfig.inspect(Constants.CONFIG_NAMES.LEO_ID)!.defaultValue === this.leoID) {
                    // Set as undefined - same as default
                    await w_vscodeConfig.update(Constants.CONFIG_NAMES.LEO_ID, undefined, true);
                } else {
                    // Set as value which is not default
                    await w_vscodeConfig.update(Constants.CONFIG_NAMES.LEO_ID, this.leoID, true);
                }
            }
        }
        if (!this.leoID) {
            // throw new Error("Could not get Leo ID");
            this.leoID = "None";
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
            id_ = id_.replace(/\./g, "").replace(/\,/g, "").replace(/\"/g, "").replace(/\'/g, "");
            //  Remove *all* whitespace: https://stackoverflow.com/questions/3739909
            id_ = id_.split(' ').join('');
        }
        catch (exception) {
            g.es_exception(exception);
            id_ = '';
        }
        if (id_.length < 3) {
            id_ = "";
            // throw new Error("Invalid Leo ID");
            // TODO: Show Leo Id syntax error message
            // g.EmergencyDialog(
            //   title=f"Invalid Leo ID: {tag}",
            //    message=(
            //        f"Invalid Leo ID: {old_id!r}\n\n"
            //       "Your id should contain only letters and numbers\n"
            //        "and must be at least 3 characters in length."))
        }
        return id_;
    }

    //@+node:felix.20220511231737.1: *3* app.Closing
    //@+node:felix.20220511231737.2: *4* app.closeLeoWindow
    /**
     * Attempt to close a Leo window.
     *
     * Return False if the user veto's the close.
     *
     * finish_quit - usually True, close Leo when last file closes, but
     *               False when closing an already-open-elsewhere file
     *               during initial load, so UI remains for files
     *               further along the command line.
     */
    public async closeLeoWindow(frame: LeoFrame, new_c?: Commands, finish_quit = true): Promise<boolean> {
        const c = frame.c;
        if (g.app.debug.includes('shutdown')) {
            g.trace(`changed: ${c.changed} ${c.shortFileName()}`);
        }
        c.endEditing();  // Commit any open edits.
        if (c.promptingForClose) {
            // There is already a dialog open asking what to do.
            return false;
        }

        // TODO : NEEDED ?
        // Make sure .leoRecentFiles.txt is written.
        // g.app.recentFilesManager.writeRecentFilesFile(c)

        if (c.changed) {
            c.promptingForClose = true;
            const veto = await frame.promptForSave();
            console.log('VETO (true we exit doing nothing)', veto);

            c.promptingForClose = false;
            if (veto) {
                return false;
            }
        }
        // g.app.setLog(None)  // no log until we reactive a window.

        g.doHook("close-frame", { c: c });
        //
        // Save the window state for *all* open files.
        if (g.app.commander_cacher) {
            g.app.commander_cacher.commit();  // store cache, but don't close it.
        }
        // This may remove frame from the window list.
        if (g.app.windowList.includes(frame)) {
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

        if (g.app.windowList.length) {
            const c2 = new_c || g.app.windowList[0].c;
            g.app.selectLeoWindow(c2);
        } else if (finish_quit && !g.unitTesting) {
            // * Does not terminate when last is closed: Present 'new' and 'open' buttons instead!
            // g.app.finishQuit();
        }
        return true;  // The window has been closed.
    }
    //@+node:felix.20220511231737.4: *4* app.destroyWindow
    /**
     * Destroy all ivars in a Leo frame.
     */
    public async destroyWindow(frame: LeoFrame): Promise<void> {
        if (g.app.debug.includes('shutdown')) {
            g.pr(`destroyWindow:  ${frame.c.shortFileName()}`);
        }
        if (g.app.externalFilesController && g.app.externalFilesController.destroy_frame) {
            await g.app.externalFilesController.destroy_frame(frame);
        }
        if (g.app.windowList.includes(frame)) {
            g.app.forgetOpenFile(frame.c.fileName());
        }
        // force the window to go away now.
        // Important: this also destroys all the objects of the commander.
        frame.destroySelf();
    }
    //@+node:felix.20220106225805.1: *3* app.commanders
    /**
     * Return list of currently active controllers
     */
    public commanders(): Commands[] {
        return g.app.windowList.map(f => f.c);
    }
    //@+node:felix.20211226221235.1: *3* app.Detecting already-open files
    //@+node:felix.20211226221235.2: *4* app.checkForOpenFile
    /**
     * Warn if fn is already open and add fn to already_open_files list.
     */
    public checkForOpenFile(c: Commands, fn: string): void {
        const d: any = g.app.db;
        const tag: string = 'open-leo-files';
        if (g.app.reverting) {
            // #302: revert to saved doesn't reset external file change monitoring
            g.app.already_open_files = [];
        }
        if (d === undefined ||
            g.unitTesting ||
            g.app.batchMode ||
            g.app.reverting ||
            g.app.inBridge
        ) {
            return;
        }
        // #1519: check os.path.exists.
        /*
        const aList: string[] = g.app.db[tag] || [];  // A list of normalized file names.
        let w_any: boolean = false;
        for (let z of aList) {
            if (fs.existsSync(z) && z.toString().trim() === fn.toString().trim()) {
                w_any = true;
            }
        }
        // any(os.path.exists(z) and os.path.samefile(z, fn) for z in aList)
        if (w_any) {
            // The file may be open in another copy of Leo, or not:
            // another Leo may have been killed prematurely.
            // Put the file on the global list.
            // A dialog will warn the user such files later.
            fn = path.normalize(fn);
            if (!g.app.already_open_files.includes(fn)) {
                g.es('may be open in another Leo:', 'red');
                g.es(fn);
                g.app.already_open_files.push(fn);
            }

        } else {
            g.app.rememberOpenFile(fn);
        }
        */
        // TODO maybe
        // Temp fix
        g.app.rememberOpenFile(fn);

    }
    //@+node:felix.20211226221235.3: *4* app.forgetOpenFile
    /**
     * Forget the open file, so that is no longer considered open.
     */
    public forgetOpenFile(fn: string): void {

        const trace: boolean = g.app.debug.includes('shutdown');
        const d: any = g.app.db;
        const tag: string = 'open-leo-files';

        if (!d || !fn) {

            return; // #69.
        }

        const aList: string[] = d[tag] || [];

        fn = path.normalize(fn);

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

        // Do not call g.trace, etc. here.
        const d = g.app.db;
        const tag = 'open-leo-files';

        if (d === undefined || g.unitTesting || g.app.batchMode || g.app.reverting) {
            // pass
        } else if (g.app.preReadFlag) {
            // pass
        } else {
            const aList: string[] = d[tag] || [];
            // It's proper to add duplicates to this list.
            aList.push(path.normalize(fn));
            d[tag] = aList;
        }
    }
    //@+node:felix.20211226221235.5: *4* app.runAlreadyOpenDialog
    // def runAlreadyOpenDialog(self, c):
    //     """Warn about possibly already-open files."""
    //     if g.app.already_open_files:
    //         aList = sorted(set(g.app.already_open_files))
    //         g.app.already_open_files = []
    //         g.app.gui.dismiss_splash_screen()
    //         message = (
    //             'The following files may already be open\n'
    //             'in another copy of Leo:\n\n' +
    //             '\n'.join(aList))
    //         g.app.gui.runAskOkDialog(c,
    //             title='Already Open Files',
    //             message=message,
    //             text="Ok")
    //@+node:felix.20230518231054.1: *3* app.Import utils
    //@+node:felix.20230518231054.2: *4* app.scanner_for_at_auto
    /**
     * A factory returning a scanner function for p, an @auto node.
     */
    public scanner_for_at_auto(c: Commands, p: Position): ((...args: any[]) => any) | undefined {

        const d = g.app.atAutoDict;
        for (const key in d) { // USING 'in' for KEYS

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
    public scanner_for_ext(c: Commands, ext: string): ((...args: any[]) => any) | undefined {

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
        gui?: NullGui,
        previousSettings?: PreviousSettings,
        relativeFileName?: string,
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
        if 1:
            c.initialFocusHelper()
        else:
            c.bodyWantsFocus()
        c.outerUpdate()
        */
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
    //@+node:felix.20220610002953.3: *4* LM.computeLeoSettingsPath
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

        // First, compute the directory of the first loaded file.
        // All entries in lm.files are full, absolute paths.
        let localDir = g.os_path_dirname(lm.files.length ? lm.files[0] : '');
        // IF NO FILES IN lm.files THEN USE WORKSPACE ROOT !
        if (!localDir) {
            localDir = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.path : "";
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
        g.app.extensionsDir = ""; // join(g.app.loadDir, '..', 'extensions'); // UNSUSED The leo / extensions directory
        // g.app.leoEditorDir = join(g.app.loadDir, '..', '..');
        g.app.testDir = join(g.app.loadDir, '..', 'test');

        return;
    }

    //@+node:felix.20220610002953.6: *5* LM.computeGlobalConfigDir

    public computeGlobalConfigDir(): string {
        let theDir: string = ""; // ! unused : RETURN EMPTY / FALSY FOR NOW

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
        let home: string = "";

        // Windows searches the HOME, HOMEPATH and HOMEDRIVE
        // environment vars, then gives up.
        // home = path.expanduser("~")

        // if home and len(home) > 1 and home[0] == '%' and home[-1] == '%':
        //     // Get the indirect reference to the true home.
        //     home = os.getenv(home[1:-1], default=None)

        if (os) {
            home = os.homedir();
        }

        if (home) {
            // Important: This returns the _working_ directory if home is None!
            // This was the source of the 4.3 .leoID.txt problems.
            home = g.finalize(home);
            const exists = await g.os_path_exists(home);
            const isDir = await g.os_path_isdir(home);
            if (!exists || !isDir) {
                home = "";
            }
        }

        return home;
    }
    //@+node:felix.20220610002953.8: *5* LM.computeHomeLeoDir

    public async computeHomeLeoDir(): Promise<string> {
        let homeLeoDir: string = "";

        // * RETURN FALSY STRING IF NO HOME DIR (possibly in browser)
        if (!g.app.homeDir) {
            return "";
        }

        homeLeoDir = g.finalize_join(g.app.homeDir, '.leo');
        const exists = await g.os_path_exists(homeLeoDir);

        if (exists) {
            return homeLeoDir;
        }

        // const ok = g.makeAllNonExistentDirectories(homeLeoDir);
        const w_uri = g.makeVscodeUri(homeLeoDir);
        try {
            await vscode.workspace.fs.createDirectory(w_uri);
            return homeLeoDir;
        }
        catch (exception) {
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

        let loadDir: string = __dirname || "./";
        let w_uri;
        if (vscode.workspace.workspaceFolders) {
            w_uri = vscode.workspace.workspaceFolders[0].uri;
        }

        // const loadDir2 = w_uri?.fsPath;
        loadDir = g.finalize(loadDir);
        return loadDir;
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
        # #1415.
        return fn if os.path.exists(directory) else None
     */
    //@+node:felix.20220610002953.17: *4* LM.reportDirectories
    /* 
    def reportDirectories(self):
        """Report directories."""
        # The cwd changes later, so it would be misleading to report it here.
        for kind, theDir in (
            ('home', g.app.homeDir),
            ('leo-editor', g.app.leoEditorDir),
            ('load', g.app.loadDir),
            ('config', g.app.globalConfigDir),
        ):  # g.blue calls g.es_print, and that's annoying.
            g.es(f"{kind:>10}:", os.path.normpath(theDir), color='blue')
     */
    //@+node:felix.20220406235904.1: *3* LM.Settings
    //@+node:felix.20220406235925.1: *4* LM.computeBindingLetter
    public computeBindingLetter(c: Commands, p_path: string): string {
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
    public computeLocalSettings(c: Commands, settings_d: g.SettingsDict, bindings_d: g.SettingsDict, localFlag: boolean): [g.SettingsDict, g.SettingsDict] {

        const lm = this;
        let shortcuts_d2;
        let settings_d2;

        [shortcuts_d2, settings_d2] = lm.createSettingsDicts(c, localFlag);

        if (!bindings_d) {// #1766: unit tests.
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
    public createSettingsDicts(c: Commands, localFlag: boolean): [g.SettingsDict | undefined, g.SettingsDict | undefined] {
        if (c) {
            // returns the *raw* shortcutsDict, not a *merged* shortcuts dict.
            const parser = new SettingsTreeParser(c, localFlag);
            let shortcutsDict;
            let settingsDict;
            [shortcutsDict, settingsDict] = parser.traverse();
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
        const isLeoSettings = fn && g.shortFileName(fn).toLowerCase() === 'leosettings.leo';
        const exists = await g.os_path_exists(fn);

        let c: Commands | undefined;
        let d1;
        let d2;


        if (fn && exists && lm.isLeoFile(fn) && !isLeoSettings) {
            // Open the file usinging a null gui.
            try {
                g.app.preReadFlag = true;
                c = await lm.openSettingsFile(fn);
            }
            finally {
                g.app.preReadFlag = false;
            }
            // Merge the settings from c into *copies* of the global dicts.

            [d1, d2] = lm.computeLocalSettings(
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
        if (lm.globalSettingsDict && lm.globalBindingsDict) {  // #1766.
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
    public mergeShortcutsDicts(c: Commands, old_d: any, new_d: any, localFlag: boolean): any {
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
            const aList = d.get(ks);  // A list of bi objects.

            // aList2 = [z for z in aList if not z.pane.startsWith('mode')];
            const aList2 = aList.filter((z: { pane: string }) => !z.pane.startsWith('mode'));

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
                const stroke = bi.stroke;  // This is canonicalized.
                bi.commandName = commandName;  // Add info.
                console.assert(stroke);
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

        // console.assert(d.keyType === g.KeyStroke, d.keyType); // TODO ? Needed ?
        const result = new SettingsDict(`uninverted ${d.name()}`);

        for (let stroke of Object.keys(d)) {
            for (let bi of d.get(stroke, [])) {
                const commandName = bi.commandName;
                console.assert(commandName);
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
        /* 
        const theFile = lm.openAnyLeoFile(fn);

        if (!theFile) {
            return undefined;  // Fix #843.
        }
         */
        if (!(g.unitTesting || g.app.silentMode || g.app.batchMode)) {
            // This occurs early in startup, so use the following.
            const s = `reading settings in ${(fn)}`;
            if (g.app.debug.includes('startup')) {
                console.log(s);
            }
            // g.es(s, 'blue');
            g.es(s);
        }
        // A useful trace.
        // g.trace('%20s' % g.shortFileName(fn), g.callers(3))

        // Changing g.app.gui here is a major hack.  It is necessary.
        const oldGui = g.app.gui;
        g.app.gui = g.app.nullGui;
        const c = g.app.newCommander(fn);
        const frame = c.frame;

        // frame.log.enable(false);
        // g.app.lockLog();

        g.app.openingSettingsFile = true;

        let ok: VNode | undefined;
        try {
            // ! HACK FOR LEOJS: MAKE COMMANDER FROM FAKE leoSettings.leo STRING !
            const w_fastRead: FastRead = new FastRead(c, c.fileCommands.gnxDict);
            let g_element;
            if (fn === 'leoSettings.leo') {
                [ok, g_element] = w_fastRead.readWithElementTree(fn, leojsSettingsXml);
                if (ok) {
                    c.hiddenRootNode = ok;
                }
            } else {
                ok = await c.fileCommands.openLeoFile(fn, false, true);
            }
        }
        catch (p_err) {
            //
        }
        finally {
            g.app.openingSettingsFile = false;
        }

        // g.app.unlockLog();
        frame.openDirectory = g.os_path_dirname(fn);
        c.openDirectory = frame.openDirectory;
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
        commanders = commanders.filter(c => !!c);

        let settings_d: g.SettingsDict;
        let bindings_d: g.SettingsDict;

        [settings_d, bindings_d] = lm.createDefaultSettingsDicts();

        for (let c of commanders) {
            // Merge the settings dicts from c's outline into
            // *new copies of* settings_d and bindings_d.
            [settings_d, bindings_d] = lm.computeLocalSettings(
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

        // TODO : ? THEMES NOT NEEDED ?
        /* 
        // Add settings from --theme or @string theme-name files.
        // This must be done *after* reading myLeoSettigns.leo.
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
    public async load(fileName?: string): Promise<unknown> {

        const lm: LoadManager = this;

        const t1 = process.hrtime();

        // sets lm.options and lm.files
        await lm.doPrePluginsInit(fileName);
        g.app.computeSignon();
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
        g.doHook("start1");

        if (g.app.killed) {
            return;
        }

        // ! ----------------------- MAYBE REPLACE WITH VSCODE FILE-CHANGE DETECTION ---------------- 
        // TODO: idleTimeManager
        // g.app.idleTimeManager.start();
        // ! ----------------------------------------------------------------------------------------

        const t3 = process.hrtime();
        const ok = await lm.doPostPluginsInit(); // loads recent, or, new untitled.
        g.app.makeAllBindings();

        g.app.gui.finishStartup();

        g.es('');  // Clears horizontal scrolling in the log pane.

        if (!ok) {
            return;
        }
        if (g.app.listen_to_log_flag) {
            // TODO: ?
            // g.app.listenToLog();
        }
        if (g.app.debug.includes('startup')) {
            const t4 = process.hrtime();
            console.log('');
            g.es_print(`settings:${utils.getDurationMs(t1, t2)} ms`);
            g.es_print(` plugins:${utils.getDurationMs(t2, t3)} ms`);
            g.es_print(`   files:${utils.getDurationMs(t3, t4)} ms`);
            g.es_print(`   total:${utils.getDurationMs(t1, t4)} ms`);
            console.log('');
        }

        return ok;
    }

    //@+node:felix.20210120004121.3: *4* LM.doPostPluginsInit & helpers
    /**
     * Create a Leo window for each file in the lm.files list.
     */
    public async doPostPluginsInit(): Promise<boolean> {
        // Clear g.app.initing _before_ creating commanders.
        const lm: LoadManager = this;
        g.app.initing = false;  // "idle" hooks may now call g.app.forceShutdown.
        // Create the main frame.Show it and all queued messages.
        let c: Commands | undefined;
        let c1: Commands | undefined;
        let fn: string = "";
        if (lm.files.length) {
            try {  // #1403.
                for (let n = 0; n < lm.files.length; n++) {
                    const fn = lm.files[n];
                    lm.more_cmdline_files = n < (lm.files.length - 1);
                    c = await lm.loadLocalFile(fn, g.app.gui);
                    // Returns None if the file is open in another instance of Leo.
                    if (c && !c1) {  // #1416:
                        c1 = c;
                    }
                }
            }
            catch (exception) {
                g.es_print(`Unexpected exception reading ${fn}`);
                g.es_exception(exception);
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

        if (!c1) {
            try { // #1403.
                c1 = await lm.openEmptyWorkBook();
                // Calls LM.loadLocalFile.
            }
            catch (exception) {
                g.es_print('Can not create empty workbook');
                g.es_exception(exception);
            }
        }
        c = c1;
        if (!c) {
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
        const screenshot_fn: string = lm.options['screenshot_fn'];
        if (screenshot_fn) {
            lm.make_screen_shot(screenshot_fn);
            return false;  // Force an immediate exit.
        }
        return true;
    }

    //@+node:felix.20210120004121.4: *5* LM.make_screen_shot
    public make_screen_shot(fn: string): void {
        // TODO
        console.log('TODO: make_screen_shot');

    }

    //@+node:felix.20210120004121.5: *5* LM.openEmptyWorkBook
    /**
     * Open an empty frame and paste the contents of CheatSheet.leo into it.
     */
    public async openEmptyWorkBook(): Promise<Commands | undefined> {
        // TODO
        const lm: LoadManager = this;

        /*
        // Create an empty frame.
        fn = lm.computeWorkbookFileName()
        if not fn:
            return None  # #1415
        c = lm.loadLocalFile(fn, gui=g.app.gui, old_c=None)
        if not c:
            return None  # #1201: AttributeError below.
        if g.app.batchMode and g.os_path_exists(fn):
            return c
        # Open the cheatsheet.
        fn = g.finalize_join(g.app.loadDir, '..', 'doc', 'CheatSheet.leo')
        if not g.os_path_exists(fn):
            g.es(f"file not found: {fn}")
            return None
        # Paste the contents of CheetSheet.leo into c.
        old_clipboard = g.app.gui.getTextFromClipboard()  # #933: Save clipboard.
        c2 = g.openWithFileName(fn, old_c=c)
        for p2 in c2.rootPosition().self_and_siblings():
            c2.setCurrentPosition(p2)  # 1380
            c2.copyOutline()
            # #1380 & #1381: Add guard & use vnode methods to prevent redraw.
            p = c.pasteOutline()
            if p:
                c.setCurrentPosition(p)  # 1380
                p.v.contract()
                p.v.clearDirty()
        c2.close(new_c=c)
        # Delete the dummy first node.
        root = c.rootPosition()
        root.doDelete(newNode=root.next())
        c.target_language = 'rest'
        c.clearChanged()
        c.redraw(c.rootPosition())  # # 1380: Select the root.
        g.app.gui.replaceClipboardWith(old_clipboard)  # #933: Restore clipboard
        return c
        */
        const fn: string = "";
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
    public async doPrePluginsInit(fileName?: string): Promise<void> {
        const lm: LoadManager = this;
        await lm.computeStandardDirectories();

        // Scan the command line options as early as possible.
        const options = {}; // lm.scanOptions(fileName); 
        lm.options = options; // ! no command line options !

        // const script:string = options['script'];
        // const verbose:boolean = !script;

        // Init the app.
        await lm.initApp();
        // g.app.setGlobalDb()

        // lm.reportDirectories(verbose)

        // Read settings *after* setting g.app.config and *before* opening plugins.
        // This means if-gui has effect only in per-file settings.
        await lm.readGlobalSettingsFiles();

        // reads only standard settings files, using a null gui.
        // uses lm.files[0] to compute the local directory
        // that might contain myLeoSettings.leo.
        // Read the recent files file.
        const localConfigFile = (lm.files && lm.files.length) ? lm.files[0] : undefined;

        // TODO: ? recent-file management ?
        // g.app.recentFilesManager.readRecentFiles(localConfigFile);

        // Create the gui after reading options and settings.
        lm.createGui();
        // We can't print the signon until we know the gui.
        return g.app.computeSignon();  // Set app.signon/signon1 for commanders.

    }

    //@+node:felix.20230529220941.1: *5* LM.createAllImporterData & helpers
    /**
     * New in Leo 5.5:
     *
     * Create global data structures describing importers and writers.
     */
    public createAllImporterData(): void {
        console.assert(g.app.loadDir);  // This is the only data required.
        this.createWritersData();  // Was an AtFile method.
        this.createImporterData();  // Was a LeoImportCommands method.
    }
    //@+node:felix.20230529220941.2: *6* LM.createImporterData & helper
    /** 
     * Create the data structures describing importer plugins.
     */
    public createImporterData(): void {

        console.log('TODO : createImporterData');

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

        console.log('TODO : parse_importer_dict');

        // importer_d = getattr(m, 'importer_dict', None)
        // if importer_d
        //     at_auto = importer_d.get('@auto', [])
        //     scanner_func = importer_d.get('func', None)
        //     // scanner_name = scanner_class.__name__
        //     extensions = importer_d.get('extensions', [])
        //     if at_auto
        //         // Make entries for each @auto type.
        //         d = g.app.atAutoDict
        //         for s in at_auto:
        //             d[s] = scanner_func
        //             g.app.atAutoDict[s] = scanner_func
        //             g.app.atAutoNames.add(s)
        //     if extensions
        //         // Make entries for each extension.
        //         d = g.app.classDispatchDict
        //         for ext in extensions:
        //             d[ext] = scanner_func  #importer_d.get('func')#scanner_class



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

        console.log('TODO : createWritersData');

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
        //             except Exception:
        //                 g.es_exception()
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

        console.log('TODO : createWritersData');

        // writer_d = getattr(m, 'writer_dict', None)
        // if writer_d
        //     at_auto = writer_d.get('@auto', [])
        //     scanner_class = writer_d.get('class', None)
        //     extensions = writer_d.get('extensions', [])
        //     if at_auto
        //         // Make entries for each @auto type.
        //         d = g.app.atAutoWritersDict
        //         for s in at_auto
        //             aClass = d.get(s)
        //             if aClass and aClass != scanner_class
        //                 g.trace(
        //                     f"{sfn}: duplicate {s} class {aClass.__name__} "
        //                     f"in {m.__file__}:")
        //             else
        //                 d[s] = scanner_class
        //                 g.app.atAutoNames.add(s)


        //     if extensions
        //         // Make entries for each extension.
        //         d = g.app.writersDispatchDict
        //         for ext in extensions
        //             aClass = d.get(ext)
        //             if aClass and aClass != scanner_class
        //                 g.trace(f"{sfn}: duplicate {ext} class", aClass, scanner_class)
        //             else
        //                 d[ext] = scanner_class


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
                # This can happen when launching Leo from IPython.
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
        console.assert(g.app.loadManager);

        // Make sure we call the new leoPlugins.init top-level function.
        // leoPlugins.init(); // TODO: plugins system ? 

        // Force the user to set g.app.leoID.
        await g.app.setLeoID(true, verbose);

        // w_leoID will at least be 'None'.
        g.app.idleTimeManager = new IdleTimeManager();
        // g.app.backgroundProcessManager = new leoBackground.BackgroundProcessManager();
        g.app.externalFilesController = new ExternalFilesController();
        // g.app.recentFilesManager = new RecentFilesManager(); // ! HANDLED with vscode workspace recent files
        g.app.config = new GlobalConfigManager();
        g.app.nodeIndices = new NodeIndices(g.app.leoID);
        // g.app.sessionManager = leoSessions.SessionManager(); // ! HANDLED with vscode workspace recent files

        // TODO: plugins system ? 
        // Complete the plugins class last.
        // g.app.pluginsController.finishCreate();

        return;

    }

    //@+node:felix.20210120004121.31: *4* LM.loadLocalFile & helpers
    public async loadLocalFile(fn: string, gui: NullGui, old_c?: Commands): Promise<Commands | undefined> {

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
        const previousSettings: PreviousSettings = await lm.getPreviousSettings(fn);

        // Step 2: open the outline in the requested gui.
        // For .leo files (and zipped .leo file) this opens the file a second time.
        c = await lm.openFileByName(fn, gui, old_c, previousSettings);
        return c;
    }
    //@+node:felix.20220418012120.1: *5* LM.openEmptyLeoFile
    /**
     * Open an empty, untitled, new Leo file.
     */
    public async openEmptyLeoFile(gui: NullGui, old_c?: Commands): Promise<Commands> {

        const lm = this;
        const w_previousSettings = await lm.getPreviousSettings(undefined);
        // Create the commander for the .leo  file.
        const c: Commands = g.app.newCommander(
            "",
            gui,
            w_previousSettings
        );
        g.doHook('open0');

        g.doHook("open1", { old_c: old_c, c: c, new_c: c, fileName: undefined });

        c.mFileName = "";
        c.wrappedFileName = undefined;

        // Late inits. Order matters.
        if (c.config.getBool('use-chapters') && c.chapterController) {
            c.chapterController.finishCreate();
        }
        c.clearChanged();
        g.doHook("open2", { old_c: old_c, c: c, new_c: c, fileName: undefined });
        g.doHook("new", { old_c: old_c, c: c, new_c: c });

        lm.finishOpen(c);

        return c;
    }

    //@+node:felix.20210120004121.32: *5* LM.openFileByName & helpers
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
    public async openFileByName(fn: string, gui: NullGui, old_c?: Commands, previousSettings?: PreviousSettings): Promise<Commands | undefined> {

        const lm: LoadManager = this;
        // Disable the log.
        // g.app.setLog(None);
        // g.app.lockLog();

        // Create the a commander for the .leo file.
        // Important.  The settings don't matter for pre-reads!
        // For second read, the settings for the file are *exactly* previousSettings.
        const c: Commands = g.app.newCommander(fn, gui, previousSettings);
        // Open the file, if possible.
        g.doHook('open0');

        /*
        theFile = lm.openAnyLeoFile(fn);
        if isinstance(theFile, sqlite3.Connection):
            // this commander is associated with sqlite db
            c.sqlite_connection = theFile
        */

        // Enable the log.
        // g.app.unlockLog();
        // c.frame.log.enable(true);

        // Phase 2: Create the outline.
        g.doHook("open1", { old_c: undefined, c: c, new_c: c, fileName: fn });

        const exists = await g.os_path_exists(fn);

        if (fn && exists) {
            const readAtFileNodesFlag = !!(previousSettings);
            // The log is not set properly here.
            const ok = await lm.readOpenedLeoFile(c, fn, readAtFileNodesFlag);

            if (!ok) {
                return undefined;
            }
        } else {
            // Create a wrapper .leo file if:
            // a) fn is a .leo file that does not exist or
            // b) fn is an external file, existing or not.
            await lm.initWrapperLeoFile(c, fn);
        }


        g.doHook("open2", { old_c: undefined, c: c, new_c: c, fileName: fn });

        // Phase 3: Complete the initialization.
        // g.app.writeWaitingLog(c)
        // c.setLog()
        // lm.createMenu(c, fn)
        lm.finishOpen(c); // c.initAfterLoad()

        return c;
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
            if (g.os_path_realpath(munge(fn)) === g.os_path_realpath(munge(c.mFileName))) {

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
        // console.assert(k);

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

        // c.initialFocusHelper();

        // if (k) {
        //     k.showStateAndMode();
        // }

        // c.frame.initCompleteHint();
        const index = g.app.windowList.indexOf(c.frame);
        if (index >= 0) {
            g.app.gui.frameIndex = index;
        }

        c.outerUpdate();  // #181: Honor focus requests.
    }
    //@+node:felix.20210222013344.1: *6* LM.initWrapperLeoFile
    /**
     * Create an empty file if the external fn is empty.
     *
     * Otherwise, create an @edit or @file node for the external file.
     */
    public async initWrapperLeoFile(c: Commands, fn: string): Promise<Commands> {

        let p: Position | undefined;

        const exists = await g.os_path_exists(fn);

        if (!exists) {
            p = c.rootPosition()!;
            // Create an empty @edit node unless fn is an .leo file.
            // Fix #1070: Use "newHeadline", not fn.
            p.h = fn.endsWith('.leo') ? "newHeadline" : `@edit ${fn}`;
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
        c.frame.title = c.computeWindowTitle(c.mFileName);

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
        // return zipfile.is_zipfile(fn) or fn.endswith(('.leo', 'db', '.leojs'))
        return fn.endsWith('.leo') || fn.endsWith('db') || fn.endsWith('.leojs');
    }
    public isZippedFile(fn: string): boolean {
        // ? NEEDED ?
        // TODO : zip support ?
        return false;
        // return fn && zipfile.is_zipfile(fn);
    }
    //@+node:felix.20220109233001.1: *6* LM.openAnyLeoFile
    /**
     * @deprecated Now using async vscode.workspace.fs functions
     * Open a .leo, .leojs or .db file.
     * @param fn
     * @returns number: file descriptor
     */
    public openAnyLeoFile(fn: string): number | undefined {

        const lm: LoadManager = this;

        if (fn.endsWith('.db')) {
            // TODO !
            // return sqlite3.connect(fn);
            return undefined;

        }
        let theFile: number | undefined;

        // ! now use vscode.workspace.fs async functions
        /*
        if (lm.isLeoFile(fn) && g.os_path_exists(fn)) {
            // ? NEEDED ZIP SUPPORT ?
            // if (lm.isZippedFile(fn)){
            //     theFile = lm.openZipFile(fn);
            // }else{
            //     theFile = lm.openLeoFile(fn);
            // }
            theFile = lm.openLeoFile(fn);
        }
        */
        return theFile;
    }
    //@+node:felix.20220109233518.1: *6* LM.openLeoFile
    /**
     * @deprecated Now using async vscode.workspace.fs functions
     * @param fn
     * @returns number: file descriptor
     */
    public openLeoFile(fn: string): number | undefined {

        return undefined;

        // const lm: LoadManager = this;
        /*
        try {
            let theFile: number;

            theFile = fs.openSync(fn, 'r');

            return theFile;
        }
        catch (iOError) {
            // Do not use string + here: it will fail for non-ascii strings!
            if (!g.unitTesting) {
                g.error("can not open:", fn);
            }
            return undefined;
        }
        */
    }
    //@+node:felix.20220418230225.1: *6* LM.readOpenedLeoFile
    /**
     * Call c.fileCommands.openLeoFile to open some kind of Leo file.
     *
     * the_file: An open file, which is a StringIO file for zipped files.
     *
     * Note: g.app.log is not inited here.
     */
    public async readOpenedLeoFile(c: Commands, fn: string, readAtFileNodesFlag: boolean): Promise<VNode | undefined> {

        // New in Leo 4.10: The open1 event does not allow an override of the init logic.
        // assert theFile

        // Read and close the file.
        const w_result = await c.fileCommands.openLeoFile(fn, readAtFileNodesFlag);
        if (w_result) {
            if (!c.openDirectory) {
                const theDir = g.finalize(g.os_path_dirname(fn));  // 1341
                c.openDirectory = theDir;
                c.frame.openDirectory = theDir;
            }
        }
        return w_result;

    }
    //@+node:felix.20220109232545.1: *3* LM.revertCommander
    /**
     * Revert c to the previously saved contents.
     */
    public async revertCommander(c: Commands): Promise<void> {
        const lm: LoadManager = this;
        const fn: string = c.mFileName;
        // Re-read the file.
        // const theFile = lm.openAnyLeoFile(fn);

        // const w_uri = vscode.Uri.file(fn);
        const w_uri = g.makeVscodeUri(fn);

        try {
            await vscode.workspace.fs.stat(w_uri);
            // OK exists
            c.fileCommands.initIvars();
            await c.fileCommands.getLeoFile(fn, undefined, undefined, false);
        } catch {
            // Does not exist !
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

    constructor(settingsDict: g.SettingsDict | undefined, shortcutsDict: g.SettingsDict | undefined) {
        if (!shortcutsDict || !settingsDict) {  // #1766: unit tests.
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
            `${this.shortcutsDict}\n>`);
    };

}
//@-others
//@@language typescript
//@@tabwidth -4
//@@pagewidth 70
//@-leo
