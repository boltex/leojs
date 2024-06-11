//@+leo-ver=5-thin
//@+node:felix.20210110222544.1: * @file src/core/leoCommands.ts
//@+<< imports >>
//@+node:felix.20210220194059.1: ** << imports >>
import * as vscode from 'vscode';
import { Utils as uriUtils } from 'vscode-uri';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';
import * as child_process from 'child_process';
import * as g from './leoGlobals';
import { LeoGui } from './leoGui';
import { new_cmd_decorator } from './decorators';
import { FileCommands } from './leoFileCommands';
import { CommanderOutlineCommands } from '../commands/commanderOutlineCommands';
import { CommanderFileCommands } from '../commands/commanderFileCommands';
import { CommanderEditCommands } from '../commands/commanderEditCommands';
import { CommanderHelpCommands } from '../commands/commanderHelpCommands';
import { Position, VNode, StackEntry, NodeIndices } from './leoNodes';
import { NodeHistory } from './leoHistory';
import { Undoer } from './leoUndo';
import { LocalConfigManager } from './leoConfig';
import { AtFile } from './leoAtFile';
import { LeoFind } from './leoFind';
import { LeoImportCommands, TopLevelImportCommands } from './leoImport';
import { ChapterController } from './leoChapters';
import {
    PersistenceDataController,
    TopLevelPersistanceCommands,
} from './leoPersistence';
import {
    EditCommandsClass,
    TopLevelEditCommands,
} from '../commands/editCommands';
import { EditFileCommandsClass, GitDiffController } from '../commands/editFileCommands';
import { TopLevelCompareCommands } from './leoCompare';
import { GoToCommands } from '../commands/gotoCommands';
import { LeoFrame, StringTextWrapper } from './leoFrame';
import { PreviousSettings } from './leoApp';
import { TagController } from './nodeTags';
import { QuickSearchController } from './quicksearch';
import { ScriptingController } from './mod_scripting';
import { ShadowController } from './leoShadow';
import { RstCommands } from './leoRst';
import { TopLevelSessionsCommands } from './leoSessions';
import { CommanderWrapper } from './leoCache';
import { HelpCommandsClass } from '../commands/helpCommands';
import * as typescript from 'typescript';
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);
if (g.isBrowser) {
    // @ts-expect-error
    crypto.randomUUID = globalThis.crypto.randomUUID;
    // @ts-expect-error
    crypto.getRandomValues = globalThis.crypto.getRandomValues;
}

//@-<< imports >>
//@+others
//@+node:felix.20211017232128.1: ** applyMixins
function applyMixins(derivedCtor: any, constructors: any[]): void {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                Object.create(null)
            );
        });
    });
}

//@+node:felix.20221011000033.1: ** cmd (decorator)
/**
 * Command decorator for the Commands class.
 */
function cmd(p_name: string, p_doc: string) {
    return new_cmd_decorator(p_name, p_doc, ['c']);
}
//@+node:felix.20210224000242.1: ** interface HoistStackEntry
export interface HoistStackEntry {
    p: Position;
    expanded: boolean;
}
//@+node:felix.20210110223514.1: ** class Commands
/**
 * A per-outline class that implements most of Leo's commands. The
 * "c" predefined object is an instance of this class.
 *
 * c.initObjects() creates subcommanders corresponding to files in the
 * leo/core and leo/commands. All of Leo's core code is accessible
 * via this class and its subcommanders.
 */
export class Commands {
    // Official ivars.
    private _currentPosition: Position | undefined;
    private _topPosition: Position | undefined;

    public subCommanders: any[];
    public configurables: any[];
    public hiddenRootNode: VNode;
    public fileCommands: FileCommands;
    public atFileCommands: AtFile;
    public findCommands: LeoFind;
    public importCommands: LeoImportCommands;
    public persistenceController: PersistenceDataController;

    // 
    public theTagController: TagController;
    public quicksearchController: QuickSearchController;

    public chapterController: ChapterController;
    public shadowController: ShadowController;
    public undoer: Undoer;
    public nodeHistory: NodeHistory;
    public gui: LeoGui;
    public replace_errors: string[] = [];
    public warnings_dict: { [key: string]: boolean } = {};

    // TODO fake frame needed FOR wrapper and hasSelection
    // TODO : maybe MERGE frame.tree.generation WITH _treeId?
    public frame: LeoFrame;

    //@+others
    //@+node:felix.20210223220756.1: *3* Commander IVars
    //@+node:felix.20211021003423.1: *4* c.initConfigSettings
    public collapse_on_lt_arrow: boolean = true; // getBool('collapse-on-lt-arrow', default=True)
    public collapse_nodes_after_move: boolean = false;
    public verbose_check_outline: boolean = false;
    public chdir_to_relative_path: boolean | undefined;
    //@+node:felix.20210223220814.2: *4* c.initCommandIvars
    // Init ivars used while executing a command.
    public commandsDict: {
        [key: string]: (...args: any[]) => any & { __doc__: string } & {
            __func_name__: string;
        } & {
            __name__: string;
        } & { __ivars__: string[] };
    } = {}; // Keys are command names, values are functions.
    public disableCommandsMessage: string = ''; // The presence of this message disables all commands.
    public hookFunction!: (tag: string, keys: Record<string, any>) => any; // One of three places that g.doHook looks for hook functions.

    public ignoreChangedPaths = false; // True: disable path changed message in at.WriteAllHelper.
    public inCommand: boolean = false; // Interlocks to prevent premature closing of a window.
    public isZipped: boolean = false; // Set by g.openWithFileName.
    public outlineToNowebDefaultFileName: string = 'noweb.nw'; // For Outline To Noweb dialog.

    // For tangle/untangle
    public tangle_errors: number = 0;
    // Default Tangle options
    public use_header_flag: boolean = false;
    public output_doc_flag: boolean = false;
    // For hoist/dehoist commands.
    public hoistStack: HoistStackEntry[] = []; // Stack of nodes to be root of drawn tree.
    // For outline navigation.
    public navPrefix: string = ''; // Must always be a string.
    public navTime: any = undefined;

    public command_name: string = '';
    // Untouched list of executed 'doCommand' calls
    public recent_commands_list: string[] = []; // List of command name string. 
    // Command history for minibuffer (duplicate-free & re-ordered)
    public commandHistory: string[] = []; // * ORIGINALLY IN leoKeys.py FROM LEO.

    // * USED AS STRING IN LEOJS - ONLY USED AS A FLAG ANYWAYS IN LEO.
    // public sqlite_connection: string | undefined = undefined;

    //@+node:felix.20210223220814.3: *4* c.initDebugIvars
    // Init Commander debugging ivars.
    public command_count: number = 0;
    public scanAtPathDirectivesCount: number = 0;
    public trace_focus_count: number = 0;

    //@+node:felix.20210223220814.4: *4* c.initDocumentIvars
    // Init per-document ivars.
    public expansionLevel: number = 0; // The expansion level of this outline.
    public expansionNode: Position | undefined = undefined; // The last node we expanded or contracted.
    public nodeConflictList: any[] = []; // List of nodes with conflicting read-time data.
    public nodeConflictFileName: string | undefined = undefined; // The fileName for c.nodeConflictList.
    public user_dict = {}; // Non-persistent dictionary for free use by scripts and plugins.

    //@+node:felix.20210223220814.5: *4* c.initEventIvars
    // Init ivars relating to gui events.
    public configInited = false;
    public doubleClickFlag = false;
    public exists = true; // Indicate that this class exists and has not been destroyed.
    public vs: Record<string, any> = {};

    public in_qt_dialog = false; // True: in a qt dialog.
    public loading = false; // True: we are loading a file: disables c.setChanged()
    public promptingForClose = false; // True: lock out additional closing dialogs.
    public suppressHeadChanged = false; // True: prevent setting c.changed when switching chapters.
    // Flags for c.outerUpdate...
    public enableRedrawFlag = true;
    public requestCloseWindow = false;
    public requestedFocusWidget: any; // TODO : Fix by typing properly when using only widget or wrapper!
    public requestLaterRedraw = false;

    //@+node:felix.20210223220814.6: *4* c.initFileIvars
    // Init file-related ivars of the commander.
    public changed = false; // True: the outline has changed since the last save.
    public ignored_at_file_nodes: string[] = []; // (headers)
    public import_error_nodes: string[] = []; // List of nodes for c.raise_error_dialogs. (headers)
    public last_dir: string | undefined = undefined; // The last used directory.
    public mFileName: string = ''; // ? Maybe Deprecated ? Do _not_ use os_path_norm: it converts an empty path to '.' (!!)
    public uri: vscode.Uri | undefined; // For vscode workspace.fs file operations
    public mRelativeFileName: string = '';

    public orphan_at_file_nodes: string[] = []; // List of orphaned nodes for c.raise_error_dialogs. (headers)
    public wrappedFileName: string | undefined = undefined; // The name of the wrapped file, for wrapper commanders, set by LM.initWrapperLeoFile

    //@+node:felix.20210223220814.7: *4* c.initOptionsIvars
    // Init Commander ivars corresponding to user options.
    public fixed: boolean = false;
    public fixedWindowPosition = [];
    public forceExecuteEntireBody: boolean = false;
    public focus_border_color: string = 'white';
    public focus_border_width: number = 1; // pixels;
    public make_node_conflicts_node: boolean = true;
    public outlineHasInitialFocus: boolean = false;
    public page_width: number = 132;
    public sparse_find: boolean = true;
    public sparse_move: boolean = true;
    public sparse_spell: boolean = true;
    public sparse_goto_visible: boolean = false;

    public stayInTreeAfterSelect: boolean = false;
    public smart_tab: boolean = false;
    public tab_width: number = -4;
    public tangle_batch_flag: boolean = false;
    public target_language: string = 'python'; // TODO : switch to js for Leojs?
    public untangle_batch_flag: boolean = false;
    // # self.use_body_focus_border = True
    // # self.use_focus_border = False
    // # Replaced by style-sheet entries.
    public vim_mode: boolean = false;
    public write_script_file: boolean = false;

    //@+node:felix.20210223220814.8: *4* c.initObjectIvars
    // These ivars are set later by leoEditCommands.createEditCommanders
    public abbrevCommands: any = undefined;
    public editCommands: EditCommandsClass;
    public db: any;// CommanderWrapper;//  Record<string, any>; // IS A DATABASE 
    public bufferCommands: any = undefined;
    public chapterCommands: any = undefined;
    public controlCommands: any = undefined;
    public convertCommands: any = undefined;
    public debugCommands: any = undefined;
    public editFileCommands: EditFileCommandsClass;
    public theScriptingController!: ScriptingController; // Set in leoApp at 'open2' event.
    public gotoCommands: GoToCommands;
    public rstCommands: RstCommands;
    public helpCommands: HelpCommandsClass;
    public keyHandler: any = undefined; // TODO same as k
    public k: any = undefined; // TODO same as keyHandler
    public keyHandlerCommands: any = undefined;
    public killBufferCommands: any = undefined;
    public macroCommands: any = undefined;
    public miniBufferWidget: any = undefined; // NOT USED IN LEOJS
    public printingController: any = undefined;
    public queryReplaceCommands: any = undefined;
    public rectangleCommands: any = undefined;
    public searchCommands: any = undefined;
    public spellCommands: any = undefined;
    public vimCommands: any = undefined;

    public config!: LocalConfigManager; // Set in constructor indirectly
    public quicksearch_controller: QuickSearchController | undefined;
    public id: number; // Replaces python id function

    //@+node:felix.20210223002937.1: *3* constructor & helpers
    constructor(
        fileName: string,
        gui?: LeoGui,
        previousSettings?: PreviousSettings,
        relativeFileName?: string
    ) {
        const c: Commands = this;
        this.id = ++g.app.commanderIdCounter; // Incremented BEFORE use, so first one is 1.

        // From Official Ivars
        this.gui = gui || g.app.gui;

        // From initFileIvars
        this.mFileName = fileName || '';
        this.mRelativeFileName = relativeFileName || '';

        // Instantiate c.config *before* initing objects.
        c.initSettings(previousSettings);

        // Initialize all subsidiary objects, including subcommanders.
        // From initObjects
        this.hiddenRootNode = new VNode(this, 'hidden-root-vnode-gnx');
        this.hiddenRootNode.h = '<hidden root vnode>';
        this.k = {};
        this.keyHandler = this.k; // TODO: REPLACE EMPTY OBJECT ??

        try {
            this.db = new CommanderWrapper(c);
        } catch (e) {
            console.log('ERROR CREATING DATABASE', e);
            this.db = {};
        }

        // Create the gui frame.
        const title = this.computeWindowTitle();
        if (!g.app.initing) {
            g.doHook("before-create-leo-frame", { c: c });
        }
        this.frame = this.gui.createLeoFrame(c, title);
        g.assert(this.frame.c === this);

        this.nodeHistory = new NodeHistory(c);

        this.initConfigSettings();

        // Define subcommanders.
        this.chapterController = new ChapterController(c);
        this.shadowController = new ShadowController(c);

        // Originally from plugins
        this.theTagController = new TagController(c);
        this.quicksearchController = new QuickSearchController(c);

        this.fileCommands = new FileCommands(c);
        this.findCommands = new LeoFind(c);
        this.atFileCommands = new AtFile(c);
        this.importCommands = new LeoImportCommands(c);
        this.persistenceController = new PersistenceDataController(c);

        // command handlers...
        this.editCommands = new EditCommandsClass(c);
        this.editFileCommands = new EditFileCommandsClass(c);
        this.gotoCommands = new GoToCommands(c);
        this.helpCommands = new HelpCommandsClass(c);

        this.rstCommands = new RstCommands(c);

        this.undoer = new Undoer(c);

        // Create the list of subcommanders.
        this.subCommanders = [
            // this.abbrevCommands,
            this.atFileCommands,
            // this.bufferCommands,
            this.chapterController,
            // this.controlCommands,
            // this.convertCommands,
            // this.debugCommands,
            this.editCommands,
            this.editFileCommands,
            this.fileCommands,
            this.findCommands,
            this.gotoCommands,
            this.helpCommands,
            this.importCommands,
            // this.keyHandler,
            // this.keyHandlerCommands,
            // this.killBufferCommands,
            this.persistenceController,
            // this.printingController,
            this.quicksearchController,
            // this.rectangleCommands,
            this.rstCommands,
            this.shadowController,
            // this.spellCommands,
            this.theTagController,
            // this.vimCommands,
            this.undoer,
        ];

        this.configurables = [...c.subCommanders];

        // From finishCreate
        c.frame.finishCreate();
        c.createCommandNames();
        c.findCommands.finishCreate();

        c.undoer.clearUndoState();
        // equivalent of k.initCommandHistory
        c.commandHistory = c.config.getData('history-list') || [];
    }

    //@+node:felix.20210223220814.10: *4* c.initSettings
    /**
     * Instantiate c.config from previous settings.
     */
    public initSettings(previousSettings: any): void {
        const c: Commands = this;
        c.config = new LocalConfigManager(c, previousSettings);
        // g.app.config.setIvarsFromSettings(c); // Removed in https://github.com/leo-editor/leo-editor/pull/2681
    }

    //@+node:felix.20230728170724.1: *4* c.valueOf & c.toString
    public toString(): string {
        // return f"Commander {id(self)}: {repr(self.mFileName)}"
        return `Commander ${this.mFileName.toString()}`;
    }
    public valueOf(): string {
        return this.toString();
    }
    //@+node:felix.20211018215401.1: *4* c.createCommandNames
    /**
     * Create all entries in c.commandsDict.
     * Do *not* clear c.commandsDict here.
     */
    private createCommandNames(): void {
        const c: Commands = this;
        for (let commandName in g.global_commands_dict) {
            c.commandsDict[commandName] = g.global_commands_dict[commandName];
        }
    }

    //@+node:felix.20231125161943.1: *4* c.computeTabTitle
    /**
     * Return the tab title for this commander.
     */
    public computeTabTitle(): string {
        const c: Commands = this;
        const file_name = c.fileName();
        if (file_name) {
            return file_name;
        }
        // Return 'untitled' or 'untitled{n}
        const n = g.app.numberOfUntitledWindows;
        const n_s = n === 1 ? '' : n.toString();
        const title = `untitled${n_s}`;
        return title;
    }

    //@+node:felix.20220511214845.1: *4* c.computeWindowTitle
    /**
     * Return the title for the top-level window.
     */
    public computeWindowTitle(fileName?: string): string {
        const c: Commands = this;

        // NO USE FOR BRANCHES IN LEOJS TITLES
        // const branch = g.gitBranchName(fileName || c.fileName());
        // const branch_s = branch ? `${branch}: ` : '';
        // const name_s = fileName || c.fileName() || 'untitled';

        let w_path;
        let fn;
        let title;
        [w_path, fn] = g.os_path_split(fileName || c.fileName());
        if (w_path) {
            title = fn + ' in ' + w_path;
        } else {
            title = fn;
        }
        return title;

        // return `${branch_s}${name_s}`;

        // let title: string;
        // if (fileName) {
        //     title = g.computeWindowTitle(fileName);
        // } else {
        //     let s = 'untitled';
        //     let n = g.app.numberOfUntitledWindows;
        //     if (n > 0) {
        //         s += n.toString();
        //     }
        //     title = g.computeWindowTitle(s);
        //     g.app.numberOfUntitledWindows = n + 1;
        // }
        // return title;
    }
    //@+node:felix.20220605211419.1: *4* c.initConfigSettings
    /**
     * Init all cached commander config settings.
     */
    public initConfigSettings(): void {
        const c: Commands = this;
        const getBool = c.config.getBool.bind(c.config);
        const getColor = c.config.getColor.bind(c.config);
        const getData = c.config.getData.bind(c.config);
        const getInt = c.config.getInt.bind(c.config);
        const getString = c.config.getString.bind(c.config);

        // c.autoindent_in_nocolor = getBool('autoindent-in-nocolor-mode');
        c.collapse_nodes_after_move = getBool('collapse-nodes-after-move');
        c.collapse_on_lt_arrow = getBool('collapse-on-lt-arrow', true);
        // c.contractVisitedNodes = getBool('contractVisitedNodes');
        // c.fixedWindowPositionData = getData('fixedWindowPosition');
        c.focus_border_color = getColor('focus-border-color') || 'red';
        // c.focus_border_command_state_color = getColor(
        //     'focus-border-command-state-color') || 'blue';
        // c.focus_border_overwrite_state_color = getColor(
        //     'focus-border-overwrite-state-color') || 'green';
        c.focus_border_width = getInt('focus-border-width') || 1; // pixels
        c.forceExecuteEntireBody = getBool('force-execute-entire-body', false);
        c.make_node_conflicts_node = getBool('make-node-conflicts-node', true);
        c.outlineHasInitialFocus = getBool('outline-pane-has-initial-focus');
        c.page_width = getInt('page-width') || 132;
        c.sparse_move = getBool('sparse-move-outline-left');
        c.sparse_find = getBool('collapse-nodes-during-finds');
        c.sparse_spell = getBool('collapse-nodes-while-spelling');
        c.sparse_goto_visible = getBool(
            'collapse-on-goto-first-last-visible',
            false
        );
        c.stayInTreeAfterSelect = getBool('stayInTreeAfterSelect');
        c.smart_tab = getBool('smart-tab');
        c.tab_width = getInt('tab-width') || -4;
        c.target_language = getString('target-language') || 'python'; // should be javascript?

        c.verbose_check_outline = getBool('verbose-check-outline', false);
        c.vim_mode = getBool('vim-mode', false);
        c.write_script_file = getBool('write-script-file');
    }

    //@+node:felix.20240531224459.1: *3* @cmd c.execute-general-script
    @cmd('execute-general-script',
        'Execute c.p and all its descendants as a script. Create a temp file if c.p is not an @<file> node.'
    )
    public async execute_general_script_command(): Promise<void> {
        /**
         * Execute c.p and all its descendants as a script.
         *
         * Create a temp file if c.p is not an @<file> node.
         *
         * @data exec-script-commands associates commands with languages.
         *
         * @data exec-script-patterns provides patterns to create clickable
         * links for error messages.
         *
         * Set the cwd before calling the command.
         */
        if (g.isBrowser) {
            g.es('\'execute-general-script\' Command not available on the web');
            return;
        }

        const c = this;
        const p = this.p;
        const tag = 'execute-general-script';

        function get_setting_for_language(setting: string): string | undefined {
            /**
             * Return the setting from the given @data setting.
             * The first colon ends each key.
             */
            const data = c.config.getData(setting) || [];
            for (const s of data) {
                const [key, val] = s.split(':', 2);
                if (key.trim() === language) {
                    return val.trim();
                }
            }
            return undefined;
        }

        // Get the language and extension.
        const d = c.scanAllDirectives(p);
        const language: string = d['language'];
        if (!language) {
            console.log(`${tag}: No language in effect at ${p.h}`);
            return;
        }
        const ext = g.app.language_extension_dict[language];
        if (!ext) {
            console.log(`${tag}: No extension for ${language}`);
            return;
        }
        // Get the command.
        const command = get_setting_for_language('exec-script-commands');
        if (!command) {
            console.log(`${tag}: No command for ${language} in @data exec-script-commands`);
            return;
        }
        // Get the optional pattern.
        const regex = get_setting_for_language('exec-script-patterns');
        // Set the directory, if possible.
        let directory: string | undefined;
        if (p.isAnyAtFileNode()) {
            const w_path = c.fullPath(p);
            directory = w_path ? path.dirname(w_path) : undefined;
        } else {
            directory = undefined;
        }
        await c.general_script_helper(command, ext, language, p, directory, regex,);
    }
    //@+node:felix.20240603233303.1: *3* @cmd c.execute-external-file
    @cmd('execute-external-file', 'Run external files.')
    public async execute_external_file(): Promise<void> {
        /*
        //@+<< docstring >>
        //@+node:felix.20240603233303.2: *4* << docstring >>
        Run external files.

        If there is an @language directive in the top node of the file,
        the external processor will be chosen based on it if known.
        Otherwise, the processor will be chosen using the file's extension
        if known.  Otherwise, on Linux a shebang line will be used if the
        external file has one. The candidate processor will be verified
        to be reachable by the shell.

        On Windows, "@language batch" and "@language shell" both will cause
        cmd.exe to be invoked as the file processor. On Linux, "@language
        shell" will cause the system's shell to be invoked. By default, this
        will be bash. If bash is not present, then the environmental variable
        $SHELL will be invoked.

        The processing programs and language file extensions can be
        specified in an @data settings node with the name
        "run-external-processor-map".

        The data in the @data node body must have a PROCESSORS, an
        EXTENSIONS section, and optionally a TERMINAL section,
        looking like this example:

            # A comment line
            # Map file extensions to language names
            EXTENSIONS
            .lua: lua    # Trailing comments allowed
            .rb: ruby

            # Map language names to processor names or paths
            PROCESSORS
            lua: lua
            ruby: C:\Ruby27-x64\bin\ruby.exe

            # Optionally specify a Linux terminal here (e.g., konsole)
            TERMINAL
            # konsole

        Blank lines and lines starting with a "#" are ignored.  If a
        full path to the processor is included, that path will be used.
        Otherwise, the processor must be findable by the shell: this
        normally means it must be on the PATH.

        Any output will be displayed in a newly-opened launching console.

        //@-<< docstring >>
        */

        if (g.isBrowser) {
            g.es('\'execute-external-file\' Command not available on the web');
            return;
        }

        const c = this;
        const MAP_SETTING_NODE = 'run-external-processor-map';
        //@+others
        //@+node:felix.20240603233303.3: *4* Declarations
        const PREFERRED_TERMINALS = ['konsole', 'xfce4-terminal', 'mate-terminal', 'gnome-terminal', 'xterm'];
        //@+node:felix.20240603233303.4: *4* SETTINGS_HELP
        const SETTINGS_HELP = `The data in the @data node body must have a
        PROCESSORS and an EXTENSIONS section, plus an optional TERMINAL
        section, looking like this example:

            # A comment line
            # Map file extensions to language names
            EXTENSIONS
            .lua: lua   # Trailing comments are allowed
            .rb: ruby

            # Map language names to processor names or paths
            PROCESSORS
            lua: lua
            ruby: C:\\Ruby27-x64\\bin\\ruby.exe

            # Optionally specify a Linux terminal (e.g., konsole) on the
            # line after the "TERMINAL" line.
            TERMINAL

        Blank lines and lines starting with a "#" are ignored.
        `;
        //@+node:felix.20240603233303.5: *4* extension map
        let LANGUAGE_EXTENSION_MAP: Record<string, string> = {
            '.cmd': 'batch',
            '.bat': 'batch',  // We'll get confused if a Linux program uses a .bat extension
            '.jl': 'julia',
            '.lua': 'lua',
            '.ps1': 'powershell',
            '.py': 'python',
            '.pyw': 'python',
            'rb': 'ruby',
        };
        //@+node:felix.20240603233303.6: *4* processor map
        let PROCESSORS: Record<string, string> = {
            'batch': 'cmd.exe',
            'julia': 'julia',
            'lua': 'lua',
            'powershell': 'powershell',
            'ruby': 'ruby',
            'shellscript': 'bash',
        };
        //@+node:felix.20240603233303.7: *4* get_external_maps
        function get_external_maps(): [Record<string, string> | null, Record<string, string> | null, string] {
            /*
                Return processor, extension maps for @data node.

                The data in the @data node body must have a PROCESSORS and an
                EXTENSIONS section, looking like this example:

                    # A comment line
                    # Map file extensions to language names
                    EXTENSIONS
                    .lua: lua  # Trailing comments are allowed
                    .rb: ruby

                    # Map language names to processor names or paths
                    PROCESSORS
                    lua: lua
                    ruby: C:\\Ruby27-x64\\bin\\ruby.exe

                    # Specify a particular Linux terminal to use
                    # e.g, /usr/bin/konsole
                    TERMINAL

                Blank lines and lines starting with a "#" are ignored.  Trailing
                in-line comments are allowed, delineated by "#".

                RETURNS
                a tuple (processor_map, extension_map, terminal)
            */

            const data: string[] = c.config.getData(MAP_SETTING_NODE, false);
            if (!data) {
                return [null, null, ''];
            }

            // Allow trailing comments:
            const lines = data.map(z => z.split('#', 1)[0]);

            function scan_map(kind: string): Record<string, string> {
                const d: Record<string, string> = {};
                const other_kind = kind === 'EXTENSIONS' ? 'PROCESSORS' : 'EXTENSIONS';
                let scanning = false;

                for (const line of lines) {
                    if (line.includes(kind)) {
                        scanning = true;
                    } else if (line.includes(other_kind)) {
                        scanning = false;
                    } else if (scanning) {
                        // Line format: a: b
                        const keyval = line.split(':', 1);
                        if (keyval.length === 2) {
                            const key = keyval[0].trim();
                            const val = keyval[1].trim();
                            d[key] = val;

                        }
                    }
                }
                return d;
            }

            // Set terminal value.
            let terminal = '';
            for (const line of lines) {
                if (line.includes('Terminal')) {
                    terminal = line;
                    break;
                }
            }

            // Set the maps.
            const processor_map = scan_map('PROCESSORS');
            const extension_map = scan_map('EXTENSIONS');
            return [processor_map, extension_map, terminal];
        }
        //@+node:felix.20240603233303.8: *4* getExeKind
        /**
         * Return the executable kind of the external file.
         *
         * If there is a language directive in effect, return it,
         * otherwise use the file extension.
         */
        function getExeKind(ext: string): string {
            return g.getLanguageFromAncestorAtFileNode(c.p) || LANGUAGE_EXTENSION_MAP[ext] || '';
        }
        //@+node:felix.20240603233303.9: *4* getProcessor
        async function getProcessor(language: string, p_path: string, extension: string): Promise<string> {
            let processor = '';
            if (language === 'python') {
                processor = process.execPath;
            } else {
                if (g.isWindows && language === 'shell') {
                    return 'cmd.exe';
                }
                processor = PROCESSORS[language] || '';
                if (!processor && g.isWindows) {
                    const ftype = await get_win_assoc(extension);
                    processor = await get_win_processor(ftype);
                }
            }
            if (processor) {
                let proc = '';
                try {
                    // proc = await which(processor);
                    proc = await isExecutableInPath(processor);
                } catch (error: any) {
                    console.error(`Error finding executable for processor: ${processor}.`, error);
                    // Handle the error or rejection here, such as returning a default value or throwing a custom error
                }

                if (!proc) {
                    processor = '';
                }
            }
            return processor;
        }
        //@+node:felix.20240609215950.1: *4* isExecutableInPath
        async function isExecutableInPath(executableName: string): Promise<string> {

            const pathDelimiter = g.isWindows ? ';' : ':';
            const directories = process.env.PATH?.split(pathDelimiter) || [];
            const fileExtensions = g.isWindows ? ['.exe', '.cmd', '.bat'] : [''];

            for (const directory of directories) {
                for (const extension of fileExtensions) {
                    let fullPath;
                    if (g.isWindows && !executableName.endsWith(extension)) {
                        fullPath = path.join(directory, `${executableName}${extension}`);
                    } else {
                        fullPath = path.join(directory, executableName); // Already ends with that extension.
                    }
                    const w_exists = await g.os_path_exists(fullPath);
                    if (w_exists && w_exists.type !== vscode.FileType.Directory) {
                        return fullPath;
                    }
                }
            }
            return '';
        }
        //@+node:felix.20240603233303.10: *4* Get Windows File Associations
        /**
         * Return Windows association for given file extension, or ''.
         *
         * The extension must include the dot.
         */
        function get_win_assoc(extension: string): Promise<string> {
            const cmd = `assoc ${extension}`;
            return new Promise((resolve, reject) => {
                child_process.exec(cmd, { encoding: 'utf-8' }, (error, stdout, stderr) => {
                    if (error) {
                        resolve('');
                    }
                    const filetype = stdout.split('=')[1] || '';
                    resolve(filetype);
                });
            });
        }

        /**
         * Get Windows' idea of the program to use for running this file type.
         *
         * Example return from ftype:
         *     Lua.Script="C:\Program Files (x86)\Lua\5.1\lua.exe" "%1" %*
         *
         * ARGUMENT
         * filetype -- a file type returned by the assoc command.
         *
         * RETURNS
         * the processor or ''
         */
        function get_win_processor(filetype: string): Promise<string> {
            if (!filetype) {
                return Promise.resolve('');
            }
            const cmd = `ftype ${filetype}`;
            return new Promise((resolve, reject) => {
                child_process.exec(cmd, { encoding: 'utf-8' }, (error, stdout, stderr) => {
                    if (error) {
                        resolve('');
                    }
                    const ftype_str = stdout || 'none';
                    if (!ftype_str) {
                        resolve('');
                    }
                    const prog_str = ftype_str.split('=')[1];
                    resolve(prog_str.split('"')[1]);
                });
            });
        }
        //@+node:felix.20240603233303.11: *4* getShell
        async function getShell(): Promise<string> {
            //  Prefer bash unless it is not present - we know its options' names
            let shell = 'bash';
            const has_bash = await isExecutableInPath(shell);
            if (!has_bash) {
                // Need bare shell name, not whole path
                let processShell = process.env.SHELL || "";
                processShell = processShell.split('/').pop() || "";
                shell = processShell;
            }
            return shell;
        }
        //@+node:felix.20240603233303.12: *4* getTerminal
        //@+others
        //@+node:felix.20240603233303.13: *5* getTerminalFromDirectory
        async function getTerminalFromDirectory(dir: string): Promise<string> {
            const BAD_NAMES = ['xdg-terminal', 'setterm', 'ppmtoterm', 'koi8rxterm', 'rofi-sensible-terminal', 'x-terminal-emulator'];
            const TERM_STRINGS = ['*-terminal', '*term'];

            for (let ts of TERM_STRINGS) {
                const cmd = `find ${dir} -type f -name ${ts}`;
                try {
                    const terminals = await new Promise<string>((resolve, reject) => {
                        child_process.exec(cmd, { encoding: 'utf-8' }, (error, stdout, stderr) => {
                            if (error) {
                                return reject(stderr);
                            }
                            resolve(stdout);
                        });
                    });
                    for (let t of terminals.split('\n')) {
                        const bare_term = t.split('/').pop() || "";
                        if (!BAD_NAMES.includes(bare_term)) {
                            return t;
                        }
                    }
                } catch (error) {
                    console.error(`Error executing command ${cmd}:`, error);
                }
            }
            return '';
        }
        //@+node:felix.20240603233303.14: *5* getCommonTerminal
        async function getCommonTerminal(names: string | string[]): Promise<string> {
            let term = '';
            if (typeof names === 'string') {
                names = [names];
            }
            for (let name of names) {
                term = await isExecutableInPath(name);
                if (term) {
                    break;
                }
            }
            return term;
        }
        //@-others

        async function getTerminal(): Promise<string> {
            const w_getCommonTerminal = await getCommonTerminal(PREFERRED_TERMINALS);
            const w_getTerminalFromDirectory1 = await getTerminalFromDirectory('/usr/bin');
            const w_getTerminalFromDirectory2 = await getTerminalFromDirectory('/bin');
            return w_getCommonTerminal || w_getTerminalFromDirectory1 || w_getTerminalFromDirectory2;
        }
        //@+node:felix.20240603233303.15: *4* getTermExecuteCmd
        /**
         * Given a terminal's name, find the command line arg to launch a program.
         *
         * First, try "--help".  If that fails, see try "--help-all".  If neither
         * has an argument or switch for "Execute", give up and assume the arg is "-x".
         */
        async function getTermExecuteCmd(terminal: string): Promise<string> {
            const HELP_CMDS = ['-h', '--help', '--help-all'];
            const EXECUTESTR = 'execute';

            //@+others
            //@+node:felix.20240603233303.16: *5* get_help_message
            function get_help_message(terminal: string, help_cmd: string): Promise<string> {
                const cmd = `${terminal} ${help_cmd}`;
                return new Promise((resolve, reject) => {
                    child_process.exec(cmd, { encoding: 'utf-8' }, (error, stdout, stderr) => {
                        if (error) {
                            // return reject(stderr);
                            resolve('');
                        }
                        resolve(stdout);
                    });
                });
            }

            //@+node:felix.20240603233303.17: *5* find_ex_arg
            function find_ex_arg(help_msg: string): string {
                for (let line of help_msg.split('\n')) {
                    if (line.includes('--command')) {
                        return '--command';
                    }
                    if (line.includes('-e')) {
                        return '-e';
                    }
                    if (line.toLowerCase().includes(EXECUTESTR)) {
                        const fields = line.trim().split(' ');
                        const arg = fields[0].split(',')[0];
                        return arg;
                    }
                }
                return '';
            }
            //@-others

            let arg = '';
            for (let cmd of HELP_CMDS) {
                const msg = await get_help_message(terminal, cmd);
                arg = find_ex_arg(msg);
                if (arg) {
                    if (arg.startsWith('--')) {
                        arg += '=';
                    } else {
                        arg += ' ';
                    }
                    break;
                }
            }
            if (!arg) {
                arg = ' -x ';
                if (terminal.includes('xterm')) {
                    arg = ' -e ';
                }
            }
            return arg;
        }
        //@+node:felix.20240603233303.18: *4* checkShebang
        async function checkShebang(filepath: string): Promise<boolean> {

            const w_uri = g.makeVscodeUri(filepath);
            let readData = await vscode.workspace.fs.readFile(w_uri);

            // const file = fs.readFileSync(filepath, { encoding: 'utf-8' });
            const file = Buffer.from(readData).toString('utf-8');
            return file.startsWith('#!');
        }
        //@+node:felix.20240603233303.19: *4* runFile
        async function runfile(fullpath: string, processor: string, terminal: string): Promise<void> {
            // direc: str = os.path.expanduser(os.path.dirname(fullpath))
            let direc = path.dirname(fullpath);
            let child;
            if (direc.startsWith('~')) {
                direc = path.join(os.homedir(), direc.slice(1));
            }

            if (g.isWindows) {
                fullpath = fullpath.replace('/', '\\');
                let cmd = '';
                if (processor) {
                    if (processor === 'cmd.exe') {
                        cmd = `start ${processor} /k ${fullpath}`;
                    } else {
                        cmd = `start cmd.exe /k ${processor} ${fullpath}`;
                    }
                } else {
                    g.es('Unknown processor', fullpath);
                    return;
                }
                child = child_process.exec(cmd);
                child.unref();
            } else if (g.isMac) {
                g.es('Cannot launch external files on a Mac yet');
            } else {
                fullpath = fullpath.replace('\\', '/');
                let term;
                if (terminal) {
                    term = terminal;
                } else {
                    term = await getTerminal();
                }
                if (!term) {
                    g.es('Cannot find a terminal to launch the external file');
                    g.es(`You can specify a terminal in an "@data ${MAP_SETTING_NODE}" setting node`);
                    g.es('  ', SETTINGS_HELP);
                    return;
                }
                const shell_name = await getShell();
                const execute_arg = await getTermExecuteCmd(term);
                let cmd = '';
                const hasShebang = await checkShebang(fullpath);
                if (!processor && hasShebang) {
                    cmd = `${term} ${execute_arg}"${shell_name} -c 'cd ${direc}; ${fullpath} ;read'" `;
                } else if (processor) {
                    cmd = `${term} ${execute_arg}"${shell_name} -c 'cd ${direc};${processor} ${fullpath} ;read'" `;
                } else {
                    g.es(`No processor for ${fullpath}`);
                    return;
                }

                child = child_process.exec(cmd);
                child.unref();
            }
        }
        //@-others

        let root: Position | undefined;
        let filepath: string | undefined;
        [root, filepath] = c.gotoCommands.find_root(c.p);
        if (root && filepath) {
            let processor_map: Record<string, string> | null;
            let extension_map: Record<string, string> | null;
            let terminal: string | null;
            [processor_map, extension_map, terminal] = get_external_maps();
            if (extension_map) {
                LANGUAGE_EXTENSION_MAP = { ...LANGUAGE_EXTENSION_MAP, ...extension_map };
            }
            if (processor_map) {
                PROCESSORS = { ...PROCESSORS, ...processor_map };
            }
            const ext = path.extname(filepath);
            const setting_terminal = terminal;
            if (setting_terminal) {
                terminal = await isExecutableInPath(terminal);
                if (!terminal) {
                    g.es(`Cannot find terminal specified in setting: ${setting_terminal}`);
                    g.es('Trying an alternative');
                }
            }
            filepath = c.fullPath(root);
            const language = getExeKind(ext);
            const processor = await getProcessor(language, filepath, ext);
            await runfile(filepath, processor, terminal);
        } else {
            g.es('Cannot find an @- file');
        }

    }
    //@+node:felix.20221010233956.1: *3* @cmd execute-script & public helpers
    @cmd('execute-script', 'Execute a *Leo* script, written in javascript.')
    public async executeScript(
        args: any = undefined,
        p: Position | undefined = undefined,
        script: string = '',
        useSelectedText: boolean = true,
        define_g: boolean = true,
        define_name: string = '__main__',
        silent: boolean = false,
        namespace: { [key: string]: any } | undefined = undefined,
        raiseFlag: boolean = false,
        runPyflakes: boolean = true
    ): Promise<void> {
        /*
        Execute a *Leo* script, written in javascript.
        Keyword args:
        args=None               Not None: set script_args in the execution environment.
        p=None                  Get the script from p.b, unless script is given.
        script=None             None: use script in p.b or c.p.b
        useSelectedText=True    False: use all the text in p.b or c.p.b.
        define_g=True           True: define g for the script.
        define_name='__main__'  Not None: define the name symbol.
        silent=False            No longer used.
        namespace=None          Not None: execute the script in this namespace.
        raiseFlag=False         True: reraise any exceptions.
        runPyflakes=True        True: (Not used in LeoJS) run pyflakes if allowed by setting.
        */
        const c: Commands = this;

        if (!p || !p.__bool__()) {
            p = undefined;
        }

        let run_pyflakes: boolean;
        if (runPyflakes) {
            run_pyflakes = c.config.getBool('run-pyflakes-on-write', false);
        } else {
            run_pyflakes = false;
        }
        if (!script) {
            if (c.forceExecuteEntireBody) {
                useSelectedText = false;
            }
            script = await g.getScript(c, p || c.p, useSelectedText);
        }
        const script_p: Position = p || c.p; // Only for error reporting below.
        // #532: check all scripts with pyflakes.
        // ? needed ?
        // if run_pyflakes and not g.unitTesting:
        //     from leo.commands import checkerCommands as cc
        //     prefix = ('c,g,p,script_gnx=None,None,None,None;'
        //               'assert c and g and p and script_gnx;\n')
        //     cc.PyflakesCommand(c).check_script(script_p, prefix + script)

        const tsCompileOptions: typescript.CompilerOptions = {
            noEmitOnError: true,
            noImplicitAny: false,
            target: typescript.ScriptTarget.ES2020,
            module: typescript.ModuleKind.CommonJS
        };

        const result = typescript.transpileModule(script, {
            compilerOptions: tsCompileOptions
        });
        const errors: string[] = [];

        if (result.diagnostics && result.diagnostics.length > 0) {
            // Handle the compilation errors.
            // For example, you can log them:
            result.diagnostics.forEach(diagnostic => {
                const message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                errors.push(message);
            });
            g.es(errors.join("\n"));
            return; // Print errors and cancel running the script.
        } else {
            // The code compiled successfully, you can now proceed to run it.
            script = result.outputText;
        }

        this.redirectScriptOutput();

        try {

            if (script.trim()) {
                // * Original python: will search for modules when the import statement is used.
                // sys.path.insert(0, os.getcwd())
                // sys.path.insert(0, g.os_path_dirname(c.fileName()))  // per SegundoBob 
                script += '\n'; // Make sure we end the script properly.

                // Wrap script as an IIAFE to allow 'await' right out the box.
                script = "(async () => {\n try {\n" +
                    script +
                    "\n} catch (e) { g.handleScriptException(c, p, e); }" +
                    "\n})();";

                try {
                    if (!namespace || !namespace['script_gnx']) {
                        namespace = namespace || {};
                        namespace['script_gnx'] = script_p.gnx;
                    }
                    // We *always* execute the script with p = c.p.
                    c.executeScriptHelper(
                        args,
                        define_g,
                        define_name,
                        namespace,
                        script
                    );
                } catch (e) {
                    g.es('interrupted');
                    if (raiseFlag) {
                        throw e;
                    }
                    g.handleScriptException(c, script_p, e);
                } finally {
                    // * Original python: reverts addition to sys path for python module imports.
                    // del sys.path[0];
                    // del sys.path[0];
                }
            } else {
                g.warning('no script selected');
            }
        } catch (e) {
            // pass
        } finally {
            this.unredirectScriptOutput();
        }
    }

    //@+node:felix.20221010233956.2: *4* c.executeScriptHelper
    public executeScriptHelper(
        args: any,
        define_g: boolean,
        define_name: string,
        namespace: any,
        script: string
    ): void {
        const c: Commands = this;
        let p: Position | undefined;
        if (c.p.__bool__()) {
            p = c.p.copy(); // *Always* use c.p and pass c.p to script.
            c.setCurrentDirectoryFromContext(p);
        } else {
            p = undefined;
        }
        const d: { [key: string]: any } = define_g
            ? { c: c, g: g, input: '', p: p }
            : {};

        d['Buffer'] = Buffer;
        d['vscode'] = vscode;
        d['crypto'] = crypto;
        d['os'] = os;
        d['path'] = path;
        d['process'] = process;
        d['child_process'] = child_process;

        if (define_name) {
            d['__name__'] = define_name;
        }
        d['script_args'] = args || [];
        d['script_gnx'] = g.app.scriptDict['script_gnx'];
        if (namespace) {
            // d.update(namespace)
            Object.assign(d, namespace);
        }
        // A kludge: reset c.inCommand here to handle the case where we *never* return.
        // (This can happen when there are multiple event loops.)
        // This does not prevent zombie windows if the script puts up a dialog...
        try {
            c.inCommand = false;
            g.app.inScript = true;
            (g.inScript as boolean) = g.app.inScript; // g.inScript is a synonym for g.app.inScript.

            // if (c.write_script_file){
            //     scriptFile = self.writeScriptFile(script)
            //     exec(compile(script, scriptFile, 'exec'), d)
            // }else{
            //     exec(script, d)
            // }

            if (c.write_script_file) {
                // TODO !
                console.log(
                    'HAS : "c.write_script_file" -> TODO RUN SCRIPT FROM FILE : ',
                    script
                );
                // scriptFile = self.writeScriptFile(script)
                // exec(compile(script, scriptFile, 'exec'), d)
            } else {
                // exec(script, d)
                new Function(
                    // 'c',
                    // 'g',
                    // 'input',
                    // 'p',
                    // '__name__',
                    // 'script_args',
                    // 'script_gnx',
                    ...Object.keys(d),
                    script
                )(
                    ...Object.keys(d).map(k => d[k])
                    // d['c'],
                    // d['g'],
                    // d['input'],
                    // d['p'],
                    // d['__name__'],
                    // d['script_args'],
                    // d['script_gnx']
                );
            }
        } catch (e) {
            // pass
        } finally {
            g.app.inScript = false;
            (g.inScript as boolean) = g.app.inScript;
        }
    }

    //@+node:felix.20221010233956.3: *4* c.redirectScriptOutput
    public redirectScriptOutput(): void {
        const c: Commands = this;
        if (
            c.exists &&
            c.config.getBool('redirect-execute-script-output-to-log-pane')
        ) {
            // TODO : FIND A WAY TO OVERRIDE CONSOLE !
            g.es("LeoJS Warning: 'redirect-execute-script-output-to-log-pane' option is not yet supported.");
            return;
            g.redirectStdout();  // Redirect stdout
            g.redirectStderr();  // Redirect stderr
        }
    }
    //@+node:felix.20221010233956.4: *4* c.setCurrentDirectoryFromContext
    public setCurrentDirectoryFromContext(p: Position): void {
        const c: Commands = this;
        const aList = g.get_directives_dict_list(p);
        const w_path = c.scanAtPathDirectives(aList);
        const curDir = g.os_path_abspath(process.cwd());
        if (w_path && w_path !== curDir) {
            try {
                process.chdir?.(w_path);
            }
            catch (e) {
                // pass
            }
        }
    }

    //@+node:felix.20221010233956.5: *4* c.unredirectScriptOutput
    public unredirectScriptOutput(): void {
        const c: Commands = this;
        if (
            c.exists &&
            c.config.getBool('redirect-execute-script-output-to-log-pane')
        ) {
            g.restoreStderr();
            g.restoreStdout();
        }
    }
    //@+node:felix.20210215185050.1: *3* c.API
    // These methods are a fundamental, unchanging, part of Leo's API.

    //@+node:felix.20210131011508.1: *4* c.Generators
    //@+node:felix.20210131011508.2: *5* c.all_nodes & all_unique_nodes
    /**
     * A generator returning all vnodes in the outline, in outline order.
     */
    public *all_nodes(): Generator<VNode> {
        const c: Commands = this;
        for (let p of c.all_positions()) {
            yield p.v;
        }
    }

    /**
     * A generator returning each vnode of the outline.
     */
    public *all_unique_nodes(): Generator<VNode> {
        const c: Commands = this;
        for (let p of c.all_unique_positions(false)) {
            yield p.v;
        }
    }

    // Compatibility with old code...
    // all_vnodes_iter = all_nodes
    // all_unique_vnodes_iter = all_unique_nodes

    //@+node:felix.20210131011508.3: *5* c.all_positions
    /**
     * A generator return all positions of the outline, in outline order.
     */
    public *all_positions(copy = true): Generator<Position> {
        const c: Commands = this;
        const p: Position | undefined = c.rootPosition();
        while (p && p.__bool__()) {
            yield copy ? p.copy() : p;
            p.moveToThreadNext();
        }
    }

    // Compatibility with old code...
    // all_positions_iter = all_positions
    // allNodes_iter = all_positions

    //@+node:felix.20210131011508.4: *5* c.all_positions_for_v
    /**
     * Generates all positions p in this outline where p.v is v.
     *
     *  Should be called with stack=None.
     *
     *  The generated positions are not necessarily in outline order.
     *
     *  By Виталије Милошевић (Vitalije Milosevic).
     */
    public *all_positions_for_v(
        v: VNode,
        stack?: StackEntry[]
    ): Generator<Position> {
        const c: Commands = this;

        if (!stack) {
            stack = [];
        }

        if (!(v instanceof VNode)) {
            g.es_print(`not a VNode: ${JSON.stringify(v)}`);
            return; // Stop the generator.
        }

        /**
         * Yield all indices i such that v.children[i] == target_v.
         */
        function* allinds(v: VNode, target_v: VNode): Generator<number> {
            const arrayLength = v.children.length;
            for (var i = 0; i < arrayLength; i++) {
                if (v.children[i].gnx === target_v.gnx) {
                    yield i;
                }
            }
        }

        /**
         * Convert the stack to a position.
         */
        function stack2pos(stack: StackEntry[]): Position {
            let v: VNode;
            let i: number;
            [v, i] = stack[stack.length - 1];
            return new Position(v, i, stack.slice(0, -1));
        }

        for (let v2 of v.parents) {
            for (let i of allinds(v2, v)) {
                stack.unshift([v, i]);
                if (v2.gnx === c.hiddenRootNode!.gnx) {
                    yield stack2pos(stack);
                } else {
                    yield* c.all_positions_for_v(v2, stack);
                }
                stack.shift();
            }
        }
    }

    //@+node:felix.20210131011508.5: *5* c.all_roots
    /**
     * A generator yielding *all* the root positions in the outline that
     * satisfy the given predicate. p.isAnyAtFileNode is the default
     * predicate.
     *
     * Once a root is found, the generator skips its subtree.
     */
    public *all_roots(
        predicate?: (p: Position) => boolean
    ): Generator<Position> {
        const c: Commands = this;
        if (!predicate) {
            // pylint: disable=function-redefined
            predicate = function (p: Position): boolean {
                return p.isAnyAtFileNode();
            };
        }
        const p: Position | undefined = c.rootPosition();
        while (p && p.__bool__()) {
            if (predicate(p)) {
                yield p.copy(); // 2017/02/19
                p.moveToNodeAfterTree();
            } else {
                p.moveToThreadNext();
            }
        }
    }

    //@+node:felix.20210131011508.6: *5* c.all_unique_positions
    /**
     * A generator return all positions of the outline, in outline order.
     * Returns only the first position for each vnode.
     */
    public *all_unique_positions(copy = true): Generator<Position> {
        const c: Commands = this;
        const p: Position | undefined = c.rootPosition();
        const seen: VNode[] = [];
        while (p && p.__bool__()) {
            if (seen.includes(p.v)) {
                p.moveToNodeAfterTree();
            } else {
                seen.push(p.v);
                yield copy ? p.copy() : p;
                p.moveToThreadNext();
            }
        }
    }

    // Compatibility with old code...
    // all_positions_with_unique_vnodes_iter = all_unique_positions

    //@+node:felix.20210131011508.7: *5* c.all_unique_roots
    /**
     * A generator yielding all unique root positions in the outline that
     * satisfy the given predicate. p.isAnyAtFileNode is the default
     * predicate.
     *
     * Once a root is found, the generator skips its subtree.
     */
    public *all_unique_roots(
        copy = true,
        predicate?: (p: Position) => boolean
    ): Generator<Position> {
        const c: Commands = this;
        if (!predicate) {
            // pylint: disable=function-redefined
            predicate = function (p: Position): boolean {
                return p.isAnyAtFileNode();
            };
        }
        const seen: VNode[] = [];
        const p: Position | undefined = c.rootPosition();
        while (p && p.__bool__()) {
            if (!seen.includes(p.v) && predicate(p)) {
                seen.push(p.v);
                yield copy ? p.copy() : p;
                p.moveToNodeAfterTree();
            } else {
                p.moveToThreadNext();
            }
        }
    }
    //@+node:felix.20210131011508.8: *5* c.safe_all_positions
    /**
     * A generator returning all positions of the outline. This generator does
     * *not* assume that vnodes are never their own ancestors.
     */
    // ! removed !
    // public *safe_all_positions(copy = true): Generator<Position> {
    //     const c: Commands = this;
    //     const p: Position | undefined = c.rootPosition(); // Make one copy.
    //     while (p && p.__bool__()) {
    //         yield copy ? p.copy() : p;
    //         p.safeMoveToThreadNext();
    //     }
    // }

    //@+node:felix.20210228004000.1: *5* c.all_Root_Children
    /**
     * Return all root children P nodes
     */
    public *all_Root_Children(copy = true): Generator<Position> {
        const c: Commands = this;
        const p: Position | undefined = c.rootPosition(); // Make one copy.
        while (p && p.__bool__()) {
            yield copy ? p.copy() : p;
            p.moveToNext();
        }
    }

    //@+node:felix.20210131011420.1: *4* c.Getters
    //@+node:felix.20210131011420.2: *5* c.currentPosition
    /**
     * Return a copy of the presently selected position or a new null
     * position. So c.p.copy() is never necessary.
     */
    public currentPosition(): Position | undefined {
        const c: Commands = this;
        if (c._currentPosition) {
            // no __bool__() check intended
            // *Always* return a copy.
            return c._currentPosition.copy();
        }
        return c.rootPosition();
    }

    // For compatibility with old scripts...
    // currentVnode = currentPosition

    //@+node:felix.20221027142613.1: *5* c.edit_widget
    public edit_widget(p: Position): false | StringTextWrapper | undefined {
        const c = this;
        return p && p.__bool__() && c.frame.tree.edit_widget(p);
    }
    //@+node:felix.20210131011420.3: *5* c.fileName & relativeFileName & shortFileName
    // Compatibility with scripts

    public fileName(): string {
        let s: string = this.mFileName || '';
        if (g.isWindows || g.isBrowser) {
            s = g.os_path_fix_drive(s);
            s = s.split('\\').join('/');
        }
        return s;
    }

    public relativeFileName(): string {
        return this.mRelativeFileName || this.mFileName;
    }

    public shortFileName(): string {
        return g.shortFileName(this.mFileName);
    }

    // * Alternative Naming
    // shortFilename = shortFileName

    //@+node:felix.20210131011420.4: *5* c.firstVisible
    /**
     * Move to the first visible node of the present chapter or hoist.
     */
    public firstVisible(): Position {
        const c: Commands = this;
        let p: Position = c.p;
        while (1) {
            let back = p.visBack(c);
            if (back && back.__bool__() && back.isVisible(c)) {
                p = back;
            } else {
                break;
            }
        }
        return p;
    }

    //@+node:felix.20230312220217.1: *5* c.getBodyLines
    /**
     * Return (head, lines, tail, oldSel, oldYview).
     *
     * - head: string containing all the lines before the selected text (or the
     *   text before the insert point if no selection)
     * - lines: list of lines containing the selected text
     *   (or the line containing the insert point if no selection)
     * - after: string containing all lines after the selected text
     *   (or the text after the insert point if no  selection)
     * - oldSel: tuple containing the old selection range, or None.
     * - oldYview: int containing the old y-scroll value, or None.
     */
    public getBodyLines(): [
        string,
        string[],
        string,
        [number, number],
        number
    ] {
        const c: Commands = this;

        const body = c.frame.body;
        const w = body.wrapper;
        const oldYview = w.getYScrollPosition();
        // Note: lines is the entire line containing the insert point if no selection.
        let head: string;
        let s: string;
        let tail: string;
        [head, s, tail] = body.getSelectionLines();
        const lines = g.splitLines(s); // Retain the newlines of each line.
        // Expand the selection.
        const i = head.length;
        const j = head.length + s.length;
        const oldSel: [number, number] = [i, j];
        return [head, lines, tail, oldSel, oldYview]; // string,list,string,tuple,int.
    }
    //@+node:felix.20210131011420.5: *5* c.getTabWidth
    /**
     * Return the tab width in effect at p.
     */
    public getTabWidth(p?: Position): number | undefined {
        const c: Commands = this;
        const val: number | undefined = g.scanAllAtTabWidthDirectives(c, p);
        return val;
    }

    //@+node:felix.20210131011420.6: *5* c.is...Position
    //@+node:felix.20210131011420.7: *6* c.currentPositionIsRootPosition
    /**
     * Return true if the current position is the root position.
     *
     * This method is called during idle time, so not generating positions
     * here fixes a major leak.
     */
    public currentPositionIsRootPosition(): boolean {
        const c: Commands = this;
        const root: Position | undefined = c.rootPosition();
        return (
            !!c._currentPosition &&
            !!root &&
            c._currentPosition.__bool__() &&
            root.__bool__() &&
            c._currentPosition.__eq__(root)
        );
    }

    // return (
    // c._currentPosition and c._rootPosition and
    // c._currentPosition == c._rootPosition)

    //@+node:felix.20210131011420.8: *6* c.currentPositionHasNext
    /**
     * Return true if the current position is the root position.

        This method is called during idle time, so not generating positions
        here fixes a major leak.
     */
    public currentPositionHasNext(): boolean {
        const c: Commands = this;
        const current: Position = c._currentPosition!;
        return current && current.__bool__() && !!current.hasNext();
    }

    //@+node:felix.20210131011420.9: *6* c.isCurrentPosition
    public isCurrentPosition(p?: Position): boolean {
        const c: Commands = this;
        if (
            !p ||
            !c._currentPosition ||
            !p.__bool__() ||
            !c._currentPosition.__bool__()
        ) {
            return false;
        }
        return p.__eq__(c._currentPosition);
    }

    //@+node:felix.20210131011420.10: *6* c.isRootPosition
    public isRootPosition(p?: Position): boolean {
        const c: Commands = this;
        const root: Position = c.rootPosition()!;
        return !!p && p.__bool__() && root.__bool__() && p.__eq__(root);
    }

    //@+node:felix.20210131011420.11: *5* c.isChanged
    public isChanged(): boolean {
        return this.changed;
    }

    //@+node:felix.20211121222033.1: *5* c.lastPosition
    public lastPosition(): Position {
        const c: Commands = this;
        const p: Position = c.rootPosition()!;
        while (p.hasNext()) {
            p.moveToNext();
        }
        while (p.hasThreadNext()) {
            p.moveToThreadNext();
        }
        return p;
    }
    //@+node:felix.20210131011420.12: *5* c.lastTopLevel
    /**
     * Return the last top-level position in the outline.
     */
    public lastTopLevel(): Position {
        const c: Commands = this;
        const p: Position = c.rootPosition()!;
        while (p.hasNext()) {
            p.moveToNext();
        }
        return p;
    }

    //@+node:felix.20210215204131.1: *5* c.lastVisible
    /**
     *Move to the last visible node of the present chapter or hoist.
     */
    public lastVisible(): Position {
        const c: Commands = this;
        let p: Position = c.p;
        while (1) {
            const next = p.visNext(c);
            if (next && next.__bool__() && next.isVisible(c)) {
                p = next;
            } else {
                break;
            }
        }
        return p;
    }

    //@+node:felix.20210131011420.13: *5* c.nullPosition
    /**
     * New in Leo 5.5: Return None.
     * Using empty positions masks problems in program logic.
     * In fact, there are no longer any calls to this method in Leo's core.
     */
    public nullPosition(): void {
        g.trace('This method is deprecated. Instead, just use None.');
        // pylint complains if we return None.
    }

    //@+node:felix.20210131011420.14: *5* c.positionExists
    /**
     * Return true if a position exists in c's tree
     */
    public positionExists(
        p: Position,
        root?: Position,
        trace?: boolean
    ): boolean {
        if (!p.__bool__() || !p.v) {
            return false;
        }

        // const rstack = root.stack + [(root.v, root._childIndex)] if root else []
        const rstack: StackEntry[] = (root && root.__bool__()) ? [...root.stack, [root.v, root._childIndex]] : [];

        // const pstack = p.stack + [(p.v, p._childIndex)]
        const pstack: StackEntry[] = [...p.stack, [p.v, p._childIndex]];


        if (rstack.length > pstack.length) {
            return false;
        }
        let par = this.hiddenRootNode!;

        function sameStackEntry(a: StackEntry, b: StackEntry): boolean {
            if (a[1] !== b[1]) {
                return false;
            }
            if (a[0] !== b[0]) {
                return false;
            }
            return true;
        }

        for (let j = 0; j < pstack.length; j++) {
            const x = pstack[j];
            if (j < rstack.length && !sameStackEntry(x, rstack[j])) {
                return false;
            }
            const [v, i] = x;
            if (i >= par.children.length || v !== par.children[i]) {
                return false;
            }
            par = v;
        }
        return true;

        // if (!p || !p.__bool__() || !p.v) {
        //     return false;
        // }
        // const rstack: StackEntry[] =
        //     root && root.__bool__()
        //         ? root.stack.concat([[root.v, root._childIndex]])
        //         : [];
        // const pstack: StackEntry[] = p.stack.concat([[p.v, p._childIndex]]);
        // if (rstack.length > pstack.length) {
        //     return false;
        // }
        // let par: VNode = this.hiddenRootNode!;

        // let arrayLength: number = pstack.length;
        // for (let j = 0; j < arrayLength; j++) {
        //     const x: StackEntry = pstack[j];
        //     if (
        //         j < rstack.length &&
        //         (x[0].gnx !== rstack[j][0].gnx || x[1] !== rstack[j][1])
        //     ) {
        //         return false;
        //     }
        //     let v: VNode;
        //     let i: number;
        //     [v, i] = x;
        //     if (i >= par.children.length || v.gnx !== par.children[i].gnx) {
        //         return false;
        //     }
        //     par = v;
        // }
        // return true;
    }

    //@+node:felix.20210131011420.15: *6* c.dumpPosition
    /**
     * Dump position p and it's ancestors.
     */
    public dumpPosition(p: Position): void {
        g.trace('=====', p.h, p._childIndex);

        let arrayLength: number = p.stack.length;
        for (let i = 0; i < arrayLength; i++) {
            const data = p.stack[i];
            let v: VNode;
            let childIndex: number;
            [v, childIndex] = data;
            console.log(`${i} ${childIndex} ${v._headString}`);
        }
    }

    //@+node:felix.20210131011420.16: *5* c.rootPosition
    /**
     * Return the root position.
     *
     * Root position is the first position in the document. Other
     * top level positions are siblings of this node.
     */
    public rootPosition(): Position | undefined {
        const c: Commands = this;
        // 2011/02/25: Compute the position directly.
        if (!!c.hiddenRootNode && c.hiddenRootNode.children.length) {
            const v: VNode = c.hiddenRootNode.children[0];
            return new Position(v, 0, undefined);
        }
        return undefined;
    }

    // * For compatibility with old scripts...
    // rootVnode = rootPosition
    // findRootPosition = rootPosition

    //@+node:felix.20210131011420.17: *5* c.shouldBeExpanded
    /**
     * Return true if the node at position p should be expanded.
     */
    public shouldBeExpanded(p: Position): boolean {
        const c: Commands = this;
        const v: VNode = p.v;
        if (!p.hasChildren()) {
            return false;
        }
        // Always clear non-existent positions.
        // v.expandedPositions: Position[] = [z for z in v.expandedPositions if c.positionExists(z)]
        v.expandedPositions = v.expandedPositions.filter((z) =>
            c.positionExists(z)
        );

        if (!p.isCloned()) {
            // Do not call p.isExpanded here! It calls this method.
            return p.v.isExpanded();
        }
        if (p.isAncestorOf(c.p)) {
            return true;
        }
        for (let p2 of v.expandedPositions) {
            if (p.__eq__(p2)) {
                return true;
            }
        }
        return false;
    }

    //@+node:felix.20210131011440.1: *5* c.visLimit
    /**
     * Return the topmost visible node.
     * This is affected by chapters and hoists.
     */
    public visLimit(): [Position | undefined, boolean | undefined] {
        const c: Commands = this;
        const cc: ChapterController = c.chapterController;
        if (c.hoistStack.length) {
            const bunch: HoistStackEntry =
                c.hoistStack[c.hoistStack.length - 1];
            const p: Position = bunch.p;
            const limitIsVisible: boolean = !cc || !p.h.startsWith('@chapter');
            return [p, limitIsVisible];
        }
        return [undefined, undefined];
    }

    //@+node:felix.20210215204308.1: *5* c.vnode2allPositions
    /**
     * Given a VNode v, find all valid positions p such that p.v = v.
     * Not really all, just all for each of v's distinct immediate parents.
     */
    public vnode2allPositions(v: VNode): Position[] {
        const c: Commands = this;
        const context: Commands = v.context; // v's commander.
        g.assert(c === context);
        const positions: Position[] = [];
        let n: number;
        for (let immediate of v.parents) {
            if (immediate.children.includes(v)) {
                n = immediate.children.indexOf(v);
            } else {
                continue;
            }
            const stack: StackEntry[] = [[v, n]];
            let isBreak: boolean = false;
            while (immediate.parents.length) {
                const parent: VNode = immediate.parents[0];
                if (parent.children.includes(immediate)) {
                    n = parent.children.indexOf(immediate);
                } else {
                    isBreak = true;
                    break;
                }
                stack.unshift([immediate, n]);
                immediate = parent;
            }
            if (!immediate.parents.length && !isBreak) {
                [v, n] = stack.pop()!;
                const p: Position = new Position(v, n, stack);
                positions.push(p);
            }
        }
        return positions;
    }

    //@+node:felix.20210215204322.1: *5* c.vnode2position
    /**
     * Given a VNode v, construct a valid position p such that p.v = v.
     */
    public vnode2position(v: VNode): Position | undefined {
        const c: Commands = this;
        const context: Commands = v.context; // v's commander.
        g.assert(c === context);
        const stack: StackEntry[] = [];
        let n: number;
        while (v.parents.length) {
            const parent: VNode = v.parents[0];
            if (parent.children.includes(v)) {
                n = parent.children.indexOf(v);
            } else {
                return undefined;
            }
            stack.unshift([v, n]);
            v = parent;
        }
        // v.parents includes the hidden root node.
        if (!stack.length) {
            // a VNode not in the tree
            return undefined;
        }
        [v, n] = stack.pop()!;
        const p: Position = new Position(v, n, stack);
        return p;
    }

    //@+node:felix.20210131011549.1: *4* c.Properties
    /**
     * commander current position property
     */
    public get p(): Position {
        const c: Commands = this;
        return c.currentPosition()!;
    }

    //@+node:felix.20210131011607.1: *4* c.Setters
    //@+node:felix.20210131011607.2: *5* c.appendStringToBody
    public appendStringToBody(p: Position, s: string): void {
        if (s) {
            p.b = p.b + g.toUnicode(s);
        }
    }

    //@+node:felix.20210131011607.3: *5* c.clearAllMarked
    public clearAllMarked(): void {
        const c: Commands = this;
        for (let p of c.all_unique_positions(false)) {
            p.v.clearMarked();
        }
    }

    //@+node:felix.20210131011607.4: *5* c.clearAllVisited
    public clearAllVisited(): void {
        const c: Commands = this;
        for (let p of c.all_unique_positions(false)) {
            p.v.clearVisited();
            p.v.clearWriteBit();
        }
    }

    //@+node:felix.20210131011607.5: *5* c.clearChanged
    /**
     * clear the marker that indicates that the .leo file has been changed.
     */
    public clearChanged(): void {
        const c: Commands = this;
        c.changed = false;
        // Clear all dirty bits _before_ setting the caption.
        for (let v of c.all_unique_nodes()) {
            v.clearDirty();
        }
        c.changed = false;
        // * Old code.
        // master = getattr(c.frame.top, 'leo_master', None)
        // if master:
        // master.setChanged(c, False)
        // // LeoTabbedTopLevel.setChanged.
        // s = c.frame.getTitle()
        // if len(s) > 2 and s[0:2] == "* ":
        // c.frame.setTitle(s[2:])
    }

    //@+node:felix.20210131011607.6: *5* c.clearMarked
    public clearMarked(p: Position): void {
        const c: Commands = this;
        p.v.clearMarked();
        g.doHook("clear-mark", { c: c, p: p });
    }

    //@+node:felix.20210131011607.7: *5* c.setBodyString
    /**
     * This is equivalent to p.b = s.
     * Warning: This method may call c.recolor() or c.redraw().
     */
    public setBodyString(p: Position, s: string): void {
        const c: Commands = this;
        const v: VNode = p.v;
        if (!c || !v) {
            return;
        }
        s = g.toUnicode(s);
        const current: Position = c.p;
        // 1/22/05: Major change: the previous test was: 'if p == current:'
        // This worked because commands work on the presently selected node.
        // But setRecentFiles may change a _clone_ of the selected node!
        if (current && current.__bool__() && p.v.gnx === current.v.gnx) {
            const w = c.frame.body.wrapper;
            w.setAllText(s);
            v.setSelection(0, 0);
            c.recolor();
        }
        // Keep the body text in the VNode up-to-date.
        if (v.b !== s) {
            v.setBodyString(s);
            v.setSelection(0, 0);
            p.setDirty();
            if (!c.isChanged()) {
                c.setChanged();
            }
        }
    }

    //@+node:felix.20210131011607.8: *5* c.setChanged
    /**
     * Set the marker that indicates that the .leo file has been changed.
     */
    public setChanged(redrawFlag: boolean = true): void {
        const c: Commands = this;
        c.changed = true;
        // Do nothing for null frames.
        //if !redrawFlag:  // Prevent flash when fixing #387.
        //    return
        // * Old code.
        // master = getattr(c.frame.top, 'leo_master', None)
        // if master:
        // master.setChanged(c, True)
        // // LeoTabbedTopLevel.setChanged.
        // s = c.frame.getTitle()
        // if len(s) > 2 and s[0] != '*':
        // c.frame.setTitle("* " + s)
    }

    //@+node:felix.20210131011607.9: *5* c.setCurrentPosition
    /**
     * Set the presently selected position. For internal use only.
     * Client code should use c.selectPosition instead.
     */
    public setCurrentPosition(p: Position): void {
        const c: Commands = this;
        if (!p || !p.__bool__()) {
            g.trace('===== no p', g.callers());
            return;
        }
        if (c.positionExists(p)) {
            if (
                c._currentPosition &&
                c._currentPosition.__bool__() &&
                p.__eq__(c._currentPosition)
            ) {
                // We have already made a copy.
                // pass;
            } else {
                // Make a copy _now_
                c._currentPosition = p.copy();
            }
        } else {
            if (g.unitTesting) {
                // New in Leo 6.7.4: *Do* raise an exception.
                throw new Error(`Invalid position: ${p.toString()}`);
            }
            c._currentPosition = c.rootPosition();
            g.trace(`Invalid position`, p.toString(), c.toString());
            g.trace(g.callers());
        }
    }

    // * For compatibility with old scripts.
    // setCurrentVnode = setCurrentPosition

    //@+node:felix.20210211234142.1: *5* c.setHeadString
    /**
     * Set the p's headline and the corresponding tree widget to s.
     * This is used in by unit tests to restore the outline.
     */
    public setHeadString(p: Position, s: string): void {
        const c: Commands = this;
        p.initHeadString(s);
        p.setDirty();
        // Change the actual tree widget so
        // A later call to c.endEditing or c.redraw will use s.

        c.frame.tree.setHeadline(p, s);
    }

    //@+node:felix.20210215204844.1: *5* c.setMarked (calls hook)
    public setMarked(p: Position): void {
        const c: Commands = this;
        p.setMarked();
        p.setDirty(); // Defensive programming.
        g.doHook("set-mark", { c: c, p: p });
    }

    //@+node:felix.20210215204937.1: *5* c.topPosition & c.setTopPosition
    /**
     * Return the root position.
     */
    public topPosition(): Position | undefined {
        const c: Commands = this;
        if (c._topPosition && c._topPosition.__bool__()) {
            return c._topPosition.copy();
        }
        return undefined;
    }

    /**
     * Set the root position.
     */
    public setTopPosition(p: Position): void {
        const c: Commands = this;
        if (p && p.__bool__()) {
            c._topPosition = p.copy();
        } else {
            c._topPosition = undefined;
        }
    }

    // Define these for compatibility with old scripts...
    // topVnode = topPosition
    // setTopVnode = setTopPosition

    //@+node:felix.20211030170417.1: *3* c.Check Outline
    //@+node:felix.20211030170815.1: *4* checkGnxs
    /**
     * Check the consistency of all gnx's.
     * Reallocate gnx's for duplicates or empty gnx's.
     * Return the number of errors found.
     */
    public checkGnxs(): number {
        const c: Commands = this;
        const d: { [key: string]: VNode[] } = {};
        // Keys are gnx's; values are sets of vnodes with that gnx.
        const ni: NodeIndices = g.app.nodeIndices!;
        const t1: [number, number] = process.hrtime();

        let count: number = 0;
        let gnx_errors: number = 0;
        for (let p of c.all_positions(false)) {
            count += 1;
            const v: VNode = p.v;
            let gnx: string = v.fileIndex;
            if (gnx) {
                // gnx must be a string.
                const aSet: VNode[] = d[gnx] || []; // new if none yet
                if (aSet.indexOf(v) === -1) {
                    // Fake a set by checking before pushing
                    aSet.push(v);
                }
                d[gnx] = aSet;
            } else {
                gnx_errors += 1;
                v.fileIndex = ni.getNewIndex(v); // expanded newGnx(v)
                g.es_print(`empty v.fileIndex: ${v} new: ${p.v.gnx}`);
            }
        }
        for (let gnx of Object.keys(d).sort()) {
            const aList: VNode[] = d[gnx];
            if (aList.length !== 1) {
                console.log('\nc.checkGnxs...');
                // g.es_print(`multiple vnodes with gnx: ${gnx}`, 'red');
                g.es_print(`multiple vnodes with gnx: ${gnx}`);
                for (let v of aList) {
                    gnx_errors += 1;
                    g.es_print(`gnx: ${v.fileIndex} ${v.h}`);
                    v.fileIndex = ni.getNewIndex(v); // expanded newGnx(v)
                }
            }
        }
        const ok: boolean = !gnx_errors;
        const t2Hrtime: [number, number] = process.hrtime(t1); // difference from t1
        const t2 = t2Hrtime[0] * 1000 + t2Hrtime[1] / 1000000; // in ms
        if (!ok) {
            g.es_print(
                `${count} nodes, ${gnx_errors} gnx errors, `
            );
        } else if (c.verbose_check_outline && !g.unitTesting) {
            g.es_print(
                `check-outline OK: ${t2} ms. ` +
                `${c.shortFileName()} ${count} nodes`
            );
        }
        return gnx_errors;
    }
    //@+node:felix.20211205223924.1: *4* c.checkLinks & helpers
    /**
     * Check the consistency of all links in the outline.
     */
    public checkLinks(): number {
        // This is too slow a test to be run outside of unit tests.
        const c: Commands = this;
        let count: number = 0;
        let errors: number = 0;

        for (let p of c.all_positions()) {
            count += 1;
            if (!c.checkThreadLinks(p)) {
                errors += 1;
                break;
            }
            if (!c.checkSiblings(p)) {
                errors += 1;
                break;
            }
            if (!c.checkParentAndChildren(p)) {
                errors += 1;
                break;
            }
        }
        return errors;
    }
    //@+node:felix.20211205223924.2: *5* c.checkParentAndChildren
    /**
     * Check consistency of parent and child data structures.
     */
    public checkParentAndChildren(p: Position): boolean {
        const c: Commands = this;

        const _assert = function (condition: any) {
            return g._assert(condition, false);
        };

        const dump = function (p: Position) {
            if (p && p.__bool__() && p.v) {
                p.v.dump();
            } else if (p && p.__bool__()) {
                console.log('<no p.v>');
            } else {
                console.log('<no p>');
            }
        };

        if (p.hasParent()) {
            const n: number = p.childIndex();
            if (!_assert(p.__eq__(p.parent().moveToNthChild(n)))) {
                g.trace(`p != parent().moveToNthChild(${n})`);
                dump(p);
                dump(p.parent());
                return false;
            }
        }

        if (p.level() > 0 && !_assert(p.v.parents)) {
            g.trace('no parents');
            dump(p);
            return false;
        }

        for (let child of p.children()) {
            if (!c.checkParentAndChildren(child)) {
                return false;
            }
            if (!_assert(p.__eq__(child.parent()))) {
                g.trace('p != child.parent()');
                dump(p);
                dump(child.parent());
                return false;
            }
        }
        if (p.hasNext()) {
            if (!_assert(p.next().parent().__eq__(p.parent()))) {
                g.trace('p.next().parent() != p.parent()');
                dump(p.next().parent());
                dump(p.parent());
                return false;
            }
        }
        if (p.hasBack()) {
            if (!_assert(p.back().parent().__eq__(p.parent()))) {
                g.trace('p.back().parent() != parent()');
                dump(p.back().parent());
                dump(p.parent());
                return false;
            }
        }
        // Check consistency of parent and children arrays.
        // very nodes gets visited, so a strong test need only check consistency
        // between p and its parent, not between p and its children.
        const parent_v: VNode = p._parentVnode()!;
        const n: number = p.childIndex();
        if (!_assert(parent_v.children[n] === p.v)) {
            g.trace('parent_v.children[n] != p.v');
            parent_v.dump();
            p.v.dump();
            return false;
        }
        return true;
    }
    //@+node:felix.20211205223924.3: *5* c.checkSiblings
    /**
     * * Check the consistency of next and back links.
     */
    public checkSiblings(p: Position): boolean {
        const back: Position = p.back();
        const next: Position = p.next();
        if (back && back.__bool__()) {
            if (!g._assert(p.__eq__(back.next()))) {
                g.trace(
                    `p!=p.back().next()\n`,
                    `     back: ${back}\n`,
                    `back.next: ${back.next()}`
                );
                return false;
            }
        }
        if (next && next.__bool__()) {
            if (!g._assert(p.__eq__(next.back()))) {
                g.trace(
                    `p!=p.next().back\n`,
                    `     next: ${next}\n`,
                    `next.back: ${next.back()}`
                );
                return false;
            }
        }
        return true;
    }
    //@+node:felix.20211205223924.4: *5* c.checkThreadLinks
    /**
     * * Check consistency of threadNext & threadBack links.
     */
    public checkThreadLinks(p: Position): boolean {
        const threadBack: Position = p.threadBack();
        const threadNext: Position = p.threadNext();
        if (threadBack.__bool__()) {
            if (!g._assert(p.__eq__(threadBack.threadNext()))) {
                g.trace('p!=p.threadBack().threadNext()');
                return false;
            }
        }
        if (threadNext.__bool__()) {
            if (!g._assert(p.__eq__(threadNext.threadBack()))) {
                g.trace('p!=p.threadNext().threadBack()');
                return false;
            }
        }
        return true;
    }
    //@+node:felix.20230730162340.1: *5* c.checkVnodeLinks & helpers
    /**
     * Check all vnode links.
     *
     * Attempt error recovery if recover_flag is True.
     * Unit tests may set recover_flag to False for strict tests.
     *
     * Return the number of errors.
     */
    public checkVnodeLinks(): number {

        const c: Commands = this;

        //@+others  // Define helpers.
        //@+node:felix.20230730162340.2: *6* find_errors
        /**
         * Scan all vnodes for erroneous parent/child pairs.
         *
         * Return (error_list, messages, n)
         */
        function find_errors(): [[VNode, VNode][], string[], number] {

            const error_list: [VNode, VNode][] = [];
            const messages: string[] = [];
            let n = 0;
            for (const parent_v of c.all_unique_nodes()) { // Avoids recursion.
                for (const child_v of parent_v.children) {

                    // const children_n = parent_v.children.count(child_v)
                    const children_n: number = parent_v.children.filter((item) => item === child_v).length;

                    // const parents_n = child_v.parents.count(parent_v)
                    const parents_n: number = child_v.parents.filter((item) => item === parent_v).length;

                    if (children_n !== parents_n) {
                        error_list.push([parent_v, child_v]);
                        messages.push(
                            'Mismatch between parent.children and child.parents\n' +
                            `parent: ${parent_v.h} count(parent.children) = ${children_n}\n` +
                            ` child: ${child_v.h} count(child.parents = ${parents_n}`
                        );
                        n += 1;
                    }
                }
            }
            return [error_list, messages, n];

        }
        //@+node:felix.20230730162340.3: *6* fix_errors
        /**
         * Fix all erroneous nodes by adding/deleting entries from v.parents.
         */
        function fix_errors(error_list: [VNode, VNode][]): void {

            for (const [parent_v, child_v] of error_list) {

                // const children_n = parent_v.children.count(child_v)
                let children_n: number = parent_v.children.filter((item) => item === child_v).length;

                // const parents_n = child_v.parents.count(parent_v)
                let parents_n: number = child_v.parents.filter((item) => item === parent_v).length;

                if (parents_n === children_n) {
                    // pass  // Already fixed.
                } else if (parents_n < children_n) {
                    while (parents_n < children_n) {
                        // Safe.
                        child_v.parents.push(parent_v);
                        parents_n += 1;
                    }
                } else {
                    while (children_n < parents_n) {
                        let index;
                        if (child_v.parents && child_v.parents.length) {
                            // Safe.
                            index = child_v.parents.indexOf(parent_v);
                            if (index !== -1) {
                                child_v.parents.splice(index, 1);
                            }
                            children_n += 1;
                        } else {
                            // This could delete the child.
                            index = parent_v.children.indexOf(child_v);
                            if (index !== -1) {
                                parent_v.children.splice(index, 1);
                            }
                            parents_n += 1;
                        }
                    }
                }

            }
        }
        //@+node:felix.20230730162340.4: *6* undelete_nodes
        /**
         * Restore a parent link to any node that would otherwise be deleted.
         */
        function undelete_nodes(error_list: [VNode, VNode][]): void {
            const seen: VNode[] = [];
            for (const [parent_v, child_v] of error_list) {
                if ((!child_v.parents || !child_v.parents.length) && !seen.includes(child_v)) {
                    // Add child_v to *one* parent.
                    seen.push(child_v);
                    parent_v.children.push(child_v);
                    child_v.parents.push(parent_v);
                }
            }
        }
        //@+node:felix.20230730162340.5: *6* recheck
        /**
         * Rescan all vnodes to ensure that no errors remain.
         *
         * Return (error_list, messages, n).
         */
        function recheck(): [[VNode, VNode][], string[], number] {

            const error_list: [VNode, VNode][] = [];
            const messages: string[] = [];
            let n = 0;
            for (const parent_v of c.all_unique_nodes()) { // Avoids recursion.
                for (const child_v of parent_v.children) {

                    // const children_n = parent_v.children.count(child_v)
                    const children_n: number = parent_v.children.filter((item) => item === child_v).length;

                    // const parents_n = child_v.parents.count(parent_v)
                    const parents_n: number = child_v.parents.filter((item) => item === parent_v).length;
                    if (children_n !== parents_n) {
                        error_list.push([parent_v, child_v]);
                        messages.push(
                            'Error recovery failed!\n' +
                            `parent: ${parent_v.h} count(parent.children) = ${children_n}\n` +
                            ` child: ${child_v.h} count(child.parents = ${parents_n}`
                        );
                        n += 1;
                    }
                }
            }
            return [error_list, messages, n];

        }
        //@-others

        // For unit testing.
        const strict = g.app.debug.includes('test:strict');
        const verbose: boolean = ['test:verbose', 'gnx', 'shutdown', 'startup', 'verbose'].some(z => g.app.debug.includes(z));

        let [error_list, messages, n] = find_errors();
        if (n === 0) {
            return 0;
        }
        if (verbose) {
            console.log('\n');
            g.trace(`${messages.length} link error${g.plural(messages.length)}:\n`);
            console.log(messages.join('\n') + '\n');
        }
        if (strict) {
            return n;
        }
        const old_n = n;
        fix_errors(error_list);
        undelete_nodes(error_list);
        [error_list, messages, n] = recheck();
        if (n) {
            // Report the *failure* to fix links!
            console.log(messages.join('\n'));
        } else if (verbose) {
            g.trace(`Fixed ${old_n} link error${g.plural(old_n)}`);
        }

        return n;

    }
    //@+node:felix.20211101013238.1: *4* c.checkMoveWithParentWithWarning & c.checkDrag
    //@+node:felix.20211101013241.1: *5* c.checkMoveWithParentWithWarning
    /**
     * Return False if root or any of root's descendants is a clone of parent
     * or any of parents ancestors.
     */
    public checkMoveWithParentWithWarning(
        root: Position,
        parent: Position,
        warningFlag: boolean
    ): boolean {
        const c: Commands = this;
        const message: string =
            'Illegal move or drag: no clone may contain a clone of itself';
        const clonedVnodes: { [key: string]: VNode } = {};
        for (let ancestor of parent.self_and_parents(false)) {
            if (ancestor.isCloned()) {
                const v: VNode = ancestor.v;
                clonedVnodes[v.gnx] = v;
            }
        }
        if (!Object.keys(clonedVnodes).length) {
            return true;
        }
        for (let p of root.self_and_subtree(false)) {
            if (p.isCloned() && clonedVnodes[p.v.gnx]) {
                if (!g.unitTesting && warningFlag) {
                    c.alert(message);
                }
                return false;
            }
        }
        return true;
    }
    //@+node:felix.20211101013309.1: *5* c.checkDrag
    // def checkDrag(self, root, target):
    //     """Return False if target is any descendant of root."""
    //     c = self
    //     message = "Can not drag a node into its descendant tree."
    //     for z in root.subtree():
    //         if z == target:
    //             if not g.unitTesting:
    //                 c.alert(message)
    //             return False
    //     return True
    //@+node:felix.20211030170430.1: *4* checkOutline
    /**
     * Check for errors in the outline.
     * Return the number of errors.
     */
    public checkOutline(): number {
        // The check-outline command sets check_links = True
        const c: Commands = this;
        let errors = 0;
        for (const f of [c.checkVnodeLinks, c.checkGnxs]) {
            errors += f.bind(c)();
        }
        return errors;
        // g.app.structure_errors = 0;
        // let structure_errors: number = c.checkGnxs();
        // if (check_links && !structure_errors) {
        //     structure_errors += c.checkLinks();
        // }
        // return structure_errors;
    }
    //@+node:felix.20211031193257.1: *4* validateOutline
    /**
     * A legacy outline checker, retained only for compatibility.
     *
     * Not used in Leo's core or unit tests.
     */
    public validateOutline(): boolean {
        const c: Commands = this;
        return c.checkOutline() === 0;
    }
    //@+node:felix.20211226232321.1: *3* c.Convenience methods
    //@+node:felix.20230423004652.1: *4* c.fullPath
    /**
     * Return the full path (including fileName) in effect at p. Neither the
     * path nor the fileName will be created if it does not exist.
     */
    public fullPath(p: Position, simulate: boolean = false): string {
        // Search p and p's parents.
        const c = this;
        const aList = g.get_directives_dict_list(p);
        const w_path = c.scanAtPathDirectives(aList);
        return g.finalize_join(w_path, p.anyAtFileNodeName());
    }
    //@+node:felix.20220611011224.1: *4* c.getTime
    public getTime(body = true): string {
        const c = this;
        const default_format = 'M/D/YYYY H:mm:ss'; // E.g., 1/30/2003 8:31:55
        // Try to get the format string from settings.
        let format: string;
        let gmt: boolean;
        if (body) {
            format = c.config.getString('body-time-format-string');
            gmt = c.config.getBool('body-gmt-time');
        } else {
            format = c.config.getString('headline-time-format-string');
            gmt = c.config.getBool('headline-gmt-time');
        }
        if (format) {
            // * CONVERT PYTHON TO DAYJS FORMAT STRING *
            format = g.convertPythonDayjs(format);
        }
        if (!format) {
            format = default_format;
        }
        let s: string;
        try {
            // import time
            // see https://www.programiz.com/python-programming/datetime/strftime
            // and https://day.js.org/docs/en/display/format
            if (gmt) {
                s = (dayjs as any).utc().format(format); //  time.strftime(format, time.gmtime());
            } else {
                s = dayjs().format(format); //  time.strftime(format, time.localtime());
            }
        } catch (exeption) {
            g.es_exception(exeption); // Probably a bad format string in leoSettings.leo.
            s = dayjs().format(default_format); //  time.strftime(default_format, time.gmtime());
        }
        return s;
    }

    //@+node:felix.20230423004739.1: *4* c.goToLineNumber & goToScriptLineNumber
    /**
     * Go to line n (zero-based) of a script.
     * A convenience method called from g.handleScriptException.
     */
    public async goToLineNumber(n: number): Promise<void> {
        const c = this;
        await c.gotoCommands.find_file_line(n);
    }

    /**
     * Go to line n (zero-based) of a script.
     * A convenience method called from g.handleScriptException.
     */
    public async goToScriptLineNumber(n: number, p: Position): Promise<void> {
        const c = this;
        await c.gotoCommands.find_script_line(n, p);
    }
    //@+node:felix.20211226232349.1: *4* setFileTimeStamp
    /**
     * Update the timestamp for fn..
     */
    public async setFileTimeStamp(fn: string): Promise<void> {
        if (
            g.app.externalFilesController &&
            g.app.externalFilesController.set_time
        ) {
            await g.app.externalFilesController.set_time(fn);
        }
    }
    //@+node:felix.20211228212851.1: *3* c.Directive scanning
    // These are all new in Leo 4.5.1.

    //@+node:felix.20211228212851.2: *4* c.getLanguageAtCursor
    // def getLanguageAtCursor(self, p, language):
    //     """
    //     Return the language in effect at the present insert point.
    //     Use the language argument as a default if no @language directive seen.
    //     """
    //     c = self
    //     tag = '@language'
    //     w = c.frame.body.wrapper
    //     ins = w.getInsertPoint()
    //     n = 0
    //     for s in g.splitLines(p.b):
    //         if g.match_word(s, 0, tag):
    //             i = g.skip_ws(s, len(tag))
    //             j = g.skip_id(s, i)
    //             language = s[i:j]
    //         if n <= ins < n + len(s):
    //             break
    //         else:
    //             n += len(s)
    //     return language
    //@+node:felix.20211228212851.3: *4* c.getNodePath & c.getNodeFileName
    /**
     * Return the path in effect at node p.
     */
    public getNodePath(p: Position): string {
        const c: Commands = this;

        const aList: any[] = g.get_directives_dict_list(p);
        const w_path: string = c.scanAtPathDirectives(aList);
        return w_path;
    }

    /**
     * Return the full file name at node p,
     * including effects of all @path directives.
     * Return '' if p is no kind of @file node.
     */
    public getNodeFileName(p_p: Position): string {
        const c: Commands = this;

        for (let p of p_p.self_and_parents(false)) {
            const name: string = p.anyAtFileNodeName();
            if (name) {
                return g.fullPath(c, p); // #1914.
            }
        }
        return '';
    }
    //@+node:felix.20211228212851.4: *4* c.hasAmbiguousLanguage
    public hasAmbiguousLanguage(p: Position): boolean {
        const languages = new Set<string>();
        const tag = '@language';
        for (const s of g.splitLines(p.b)) {
            if (g.match_word(s, 0, tag)) {
                const i = g.skip_ws(s, tag.length);
                const j = g.skip_id(s, i);
                const word = s.slice(i, j);
                languages.add(word);
            }
        }
        return Array.from(languages).length > 1;
    }
    //@+node:felix.20211228212851.5: *4* c.scanAllDirectives
    /**
     * Scan p and ancestors for directives.
     *
     * Returns a dict containing the results, including defaults.
     */
    public scanAllDirectives(p?: Position): { [key: string]: any } {
        const c = this;
        if (!p || !p.__bool__()) {
            p = c.p;
        }

        // Defaults...
        const default_language =
            g.getLanguageFromAncestorAtFileNode(p) ||
            c.target_language ||
            'python';
        const default_delims = g.set_delims_from_language(default_language);
        const wrap = c.config.getBool('body-pane-wraps');
        const table: [string, any, any][] = [
            ['encoding', undefined, g.scanAtEncodingDirectives],
            ['lang-dict', {}, g.scanAtCommentAndAtLanguageDirectives],
            ['lineending', undefined, g.scanAtLineendingDirectives],
            ['pagewidth', c.page_width, g.scanAtPagewidthDirectives],
            ['path', undefined, c.scanAtPathDirectives],
            ['tabwidth', c.tab_width, g.scanAtTabwidthDirectives],
            ['wrap', wrap, g.scanAtWrapDirectives],
        ];
        // Set d by scanning all directives.
        const aList = g.get_directives_dict_list(p);
        let d: { [key: string]: any } = {};
        // let key, w_default, func;
        for (let [key, w_default, func] of table) {
            const val = func.bind(this)(aList);
            if (typeof val === 'undefined') {
                d[key] = w_default;
            } else {
                d[key] = val;
            }
        }
        // Post process: do *not* set commander ivars.
        const lang_dict = d['lang-dict'];
        d = {
            delims: lang_dict['delims'] || default_delims,
            comment: lang_dict['comment'], // Leo 6.4: New.
            encoding: d['encoding'],
            // Note: at.scanAllDirectives does not use the defaults for "language".
            language: lang_dict['language'] || default_language,
            'lang-dict': lang_dict, // Leo 6.4: New.
            lineending: d['lineending'],
            pagewidth: d['pagewidth'],
            path: d['path'],
            tabwidth: d['tabwidth'],
            wrap: d['wrap'],
        };
        return d;
    }
    //@+node:felix.20211228212851.6: *4* c.scanAtPathDirectives
    /**
     * Scan aList for @path directives.
     * Return a reasonable default if no @path directive is found.
     */
    public scanAtPathDirectives(aList: { [key: string]: string }[]): string {
        const c: Commands = this;
        c.scanAtPathDirectivesCount += 1; // An important statistic.
        let absbase;
        const fn = c.fileName();
        if (fn) {
            absbase = g.os_path_dirname(fn);
        } else {
            absbase = process.cwd();
        }
        // Look for @path directives.
        const w_paths: string[] = [];
        let w_path: string;
        for (let d of aList) {
            // Look for @path directives.
            w_path = d['path'];
            const warning = d['@path_in_body'];
            if (!(w_path == null)) {
                // retain empty paths for warnings.
                // Convert "path" or <path> to path.
                w_path = g.stripPathCruft(w_path);
                if (w_path && !warning) {
                    w_paths.push(w_path);
                    // We will silently ignore empty @path directives.
                }
            }
        }

        // Add absbase and reverse the list.
        w_paths.push(absbase);
        w_paths.reverse();

        // Compute the full, effective, absolute path.
        w_path = g.finalize_join(...w_paths);
        return w_path;
    }
    //@+node:felix.20211106224948.1: *3* c.Executing commands & scripts
    //@+node:felix.20211106224948.3: *4* c.doCommand
    /**
     * Execute the given command function, invoking hooks and catching exceptions.
     *
     * The code assumes that the "command1" hook has completely handled the
     * command func if g.doHook("command1") returns false. This provides a
     * simple mechanism for overriding commands.
     */
    public doCommand(command_func: (...args: any[]) => any, command_name: string, p_positionArg?: Position): any {
        const c: Commands = this;
        let p: Position = c.p;
        let return_value: any;
        // c.setLog();
        this.command_count += 1;
        // New in Leo 6.2. Set command_function and command_name ivars.
        // this.command_function = command_func; // !unused
        this.command_name = command_name;
        // The presence of this message disables all commands.
        if (c.disableCommandsMessage) {
            g.blue(c.disableCommandsMessage);
            return undefined;
        }

        if (c.exists && c.inCommand && !g.unitTesting) {
            g.app.commandInterruptFlag = true; // For sc.make_slide_show_command.
            // 1912: This message is annoying and unhelpful.
            // g.error('ignoring command: already executing a command.')
            return undefined;
        }

        g.app.commandInterruptFlag = false;
        // #2256: Update the list of recent commands.
        if (c.recent_commands_list.length > 99) {
            c.recent_commands_list.pop();
        }
        c.recent_commands_list.unshift(command_name);
        if (!g.doHook('command1', { c: c, p: p, label: command_name })) {
            try {
                c.inCommand = true;
                try {
                    return_value = command_func(p_positionArg);
                } catch (e) {
                    g.es_exception(e);
                    return_value = undefined;
                }
                if (c && c.exists) {
                    // Be careful: the command could destroy c.
                    c.inCommand = false;
                    //# c.k.funcReturn = return_value
                }
            } catch (e) {
                c.inCommand = false;
                if (g.unitTesting) {
                    throw new Error('exception executing command');
                }
                g.es_print('exception executing command');
                g.es_exception(e, c);
            }
            if (c && c.exists) {
                if (c.requestCloseWindow) {
                    c.requestCloseWindow = false;
                    // g.app.closeLeoWindow(c.frame);
                    console.log('g.app.closeLeoWindow was called!');
                } else {
                    c.outerUpdate();
                }
            }
        }
        // Be careful: the command could destroy c.
        if (c && c.exists) {
            p = c.p;
            g.doHook('command2', { c: c, p: p, label: command_name });
        }
        return return_value;
    }
    //@+node:felix.20211106224948.4: *4* c.doCommandByName
    /**
     * Execute one command, given the name of the command.
     *
     * The caller must do any required keystroke-only tasks.
     *
     * Return the result, if any, of the command.
     */
    public doCommandByName(command_name: string): any {
        const c: Commands = this;

        // Get the command's function.
        let command_func: (p?: any) => any =
            c.commandsDict[command_name.replace(/\&/g, '')];

        if (!command_func) {
            const message = `No command function for ${command_name}`;
            if (g.unitTesting || g.app.inBridge) {
                throw new Error(message);
            }
            // g.es_print(message, 'red');
            g.es_print(message);
            g.trace(g.callers());
            return undefined;
        }

        // * Here the original new_cmd_decorator decorator is implemented 'run-time'
        let ivars: string[] | undefined = (command_func as any)['__ivars__'];
        let w_position;
        if ((command_func as any)['__position__']) {
            w_position = (command_func as any)['__position__'];
        }

        if (ivars && ivars.length) {
            const w_baseObject: any = g.ivars2instance(c, g, ivars);
            command_func = command_func.bind(w_baseObject);
        } else {
            command_func = command_func.bind(c);
        }

        // Invoke the function.
        const val: any = c.doCommand(command_func, command_name, w_position);
        if (c.exists) {
            // c.frame.updateStatusLine();
        }
        return val;
    }
    //@+node:felix.20211106224948.5: *4* c.executeMinibufferCommand
    /**
     * Call c.doCommandByName, creating the required event.
     */
    public executeMinibufferCommand(commandName: string): any {
        const c: Commands = this;
        return c.doCommandByName(commandName);
    }
    //@+node:felix.20211106224948.6: *4* c.general_script_helper & helpers
    /**
     *  The official helper for the execute-general-script command.

        c:          The Commander of the outline.
        command:    The os command to execute the script.
        directory:  Optional: Change to this directory before executing command.
        ext:        The file extension for the temporary file.
        language:   The language name.
        regex:      Optional regular expression describing error messages.
                    If present, group(1) should evaluate to a line number.
                    May be a compiled regex expression or a string.
        root:       The root of the tree containing the script,
                    The script may contain section references and @others.

        Other features:

        - Create a temporary external file if `not root.isAnyAtFileNode()`.
        - Compute the final command as follows.
          1. If command contains <FILE>, replace <FILE> with the full path.
          2. If command contains <NO-FILE>, just remove <NO-FILE>.
             This allows, for example, `go run .` to work as expected.
          3. Append the full path to the command.
     */
    public async general_script_helper(
        command: string,
        ext: string,
        language: string,
        root: Position,
        directory: string | undefined = undefined,
        regex: string | RegExp | undefined = undefined
    ): Promise<void> {
        const c: Commands = this;

        // Define helper functions

        //@+others
        //@+node:felix.20211106224948.7: *5* function: put_line
        /**
         * Put the line, creating a clickable link if the regex matches.
         */

        async function put_line(s: string): Promise<void> {
            if (!regex) {
                g.es_print(s);
                return;
            }
            const m = (typeof regex === 'string' ? new RegExp(regex) : regex).exec(s);
            if (!m) {
                g.es_print(s);
                return;
            }
            try {
                const s1 = m[1];
                const s2 = m[2];
                if (s1 && s2) {
                    const n = parseInt(s1, 10) || parseInt(s2, 10);
                    const fn = isNaN(parseInt(s1, 10)) ? s1 : s2;
                    if (!isNaN(n)) {
                        s = s.replace(root_path, root.h);
                        console.log(s);
                        const [p, n2] = await find_line(fn, n);
                        const unl = p && p.__bool__() && p.get_UNL();
                        if (unl) {
                            g.es(`${s}\n${unl}::${n2}\n`);
                        } else {
                            g.es(`${s}\n`);
                        }
                    } else {
                        g.es_print(s);
                    }
                } else {
                    g.es_print(s);
                }
            } catch (err) {
                g.es_print(`Regex ${regex} must define two groups`);
            }
        }
        //@+node:felix.20211106224948.8: *5* function: find_line
        /**
         * Return the node corresponding to line n of external file given by path.
         */
        async function find_line(filePath: string, n: number): Promise<[Position | undefined, number]> {
            if (filePath === root_path) {
                return c.gotoCommands.find_file_line(n, root);
            } else {
                for (const p of c.all_positions()) {
                    if (p.isAnyAtFileNode()) {
                        const normPath = path.normalize(c.fullPath(p));
                        if (filePath === normPath) {
                            const [w_p, w_offset] = await c.gotoCommands.find_file_line(n, p);
                            return (w_p && w_p.__bool__()) ? [w_p, w_offset] : [root, n];
                        }
                    }
                }
                return [root, n];
            }
        }
        //@-others

        // Compile and check the regex.

        if (regex && typeof regex === 'string') {
            try {
                new RegExp(regex);
            } catch (err) {
                g.trace(`Bad regex: ${regex}`);
                return;
            }
        }

        const script = await g.getScript(c, root, false, false, true);
        const use_temp = !root.isAnyAtFileNode();
        let root_path: string;
        let root_pathUri: vscode.Uri | undefined;

        if (use_temp) {
            // USE this random string!
            const randomString = crypto.randomBytes(3).toString('hex');
            const tmpFile = `${os.tmpdir()}/leoScript-${randomString}`;
            const tmpDirUri = g.makeVscodeUri(tmpFile);
            await vscode.workspace.fs.createDirectory(tmpDirUri);

            root_path = path.join(tmpFile, `temp.${ext}`);
            root_pathUri = g.makeVscodeUri(root_path);

            // fs.writeFileSync(root_path, script, 'utf-8');
            await g.vscode.workspace.fs.writeFile(root_pathUri, Buffer.from(script, 'utf-8'));

        } else {
            root_path = c.fullPath(root);
        }

        let final_command = command;
        if (final_command.includes('<FILE>')) {
            final_command = final_command.replace('<FILE>', root_path);
        } else if (final_command.includes('<NO-FILE>')) {
            final_command = final_command.replace('<NO-FILE>', '').replace(root_path, '');
        } else {
            final_command = `${final_command} ${root_path}`;
        }

        const old_dir = process.cwd();
        if (!directory) {
            directory = path.dirname(root_path);
        }
        process.chdir?.(directory);

        try {
            const proc = child_process.spawn(final_command, {
                shell: true,
                stdio: ['pipe', 'pipe', 'pipe']
            });
            proc.stdout.on('data', (data) => {
                console.log(data.toString());
            });
            proc.stderr.on('data', (data) => {
                void put_line(data.toString());
            });
            await new Promise<void>((resolve) => {
                proc.on('close', () => resolve());
            });
        } finally {
            if (use_temp && root_pathUri) {
                await vscode.workspace.fs.delete(root_pathUri);
            }
            process.chdir?.(old_dir);
        }
    }
    //@+node:felix.20211106224948.10: *4* c.setComplexCommand
    /**
     * Make commandName the command to be executed by repeat-complex-command.
     */
    public setComplexCommand(commandName: string): void {
        const c: Commands = this;
        if (c.k.mb_history) {
            c.k.mb_history.unshift(commandName);
        }
    }
    //@+node:felix.20211106224948.12: *4* c.writeScriptFile (changed: does not expand expressions)
    public writeScriptFile(script: string): string | undefined {
        // Get the path to the file.
        const c: Commands = this;

        // TODO !
        /*
        let path:string = c.config.getString('script-file-path');
        if (path){
            isAbsPath = os.path.isabs(path)
            driveSpec, path = os.path.splitdrive(path)
            parts = path.split('/')
            // xxx bad idea, loadDir is often read only!
            path = g.app.loadDir
            if isAbsPath:
                // make the first element absolute
                parts[0] = driveSpec + os.sep + parts[0]
            allParts = [path] + parts
            path = g.finalize_join(*allParts)

        }else{
            path = g.finalize_join(g.app.homeLeoDir, 'scriptFile.py');
        }
        //
        // Write the file.
        try{
            with open(path, encoding='utf-8', mode='w') as f:
                f.write(script)
        }
        except e:
            g.es_exception(e)
            g.es(f"Failed to write script to {path}")
            // g.es("Check your configuration of script_file_path, currently %s" %
                // c.config.getString('script-file-path'))
            path = undefined

        return path;
        */
        return undefined;
    }
    //@+node:felix.20220102021736.1: *3* c.expand_path_expression
    /**
     * Apply Python's *standard* os.path tools to s:
     *
     * - os.path.expanduser: https://docs.python.org/3/library/os.path.html#os.path.expanduser
     * - os.path.expandvars: https://docs.python.org/3/library/os.path.html#os.path.expandvars
     *
     * Do *not* call os.path.abspath, os.path.normpath, or g.os_path_normslashes.
     */
    public expand_path_expression(s: string): string {
        if (!s) {
            return '';
        }
        let w_path = g.toUnicode(s);
        w_path = g.os_path_expanduser(w_path);
        w_path = g.os_path_expandvars(w_path);
        return w_path;
    }
    //@+node:felix.20220102021736.2: *4* c.replace_path_expression
    /**
     * local function to replace a single path expression.
     */
    public replace_path_expression(expr: string): string {
        // TODO : TEST THIS METHOD !!
        const c: Commands = this;
        const p: Position = c.p;
        const d = {
            c: c,
            g: g,
            // 'getString': c.config.getString,
            p: c.p,
            // 'os': os,
            sep: path.sep,
            // 'sys': sys,
        };
        // #1338: Don't report errors when called by g.getUrlFromNode.
        try {
            const w_path = new Function(
                'with(this) { return ' + expr + '}'
            ).call(d);
            return g.toUnicode(w_path, 'utf-8');
        } catch (e) {
            const message: string =
                `${c.shortFileName()}: ${c.p.h}\n` +
                `expression: ${expr}\n` +
                `     error: ${e}`;
            if (!this.replace_errors.includes(message)) {
                this.replace_errors.push(message);
                g.trace(message);
            }
            return expr;
        }
    }
    //@+node:felix.20211223223002.1: *3* c.File
    //@+node:felix.20211223223002.2: *4* c.archivedPositionToPosition (new)
    /**
     * Convert an archived position (a string) to a position.
     */
    public archivedPositionToPosition(s: string): Position | undefined {
        const c: Commands = this;

        s = g.toUnicode(s);
        let aList: undefined | string[] | number[] = s.split(',');

        try {
            aList = aList.map((z) => {
                return parseInt(z);
            });
        } catch (exception) {
            aList = undefined;
        }

        if (!aList || !aList.length) {
            return undefined;
        }

        const p: Position = c.rootPosition()!;
        let level: number = 0;

        while (level < aList.length) {
            let i: number = aList[level];
            while (i > 0) {
                if (p.hasNext()) {
                    p.moveToNext();
                    i -= 1;
                } else {
                    return undefined;
                }
            }
            level += 1;
            if (level < aList.length) {
                p.moveToFirstChild();
            }
        }
        return p;
    }
    //@+node:felix.20211223223002.3: *4* c.backup
    /**
     * Back up given fileName or c.fileName().
     * If useTimeStamp is True, append a timestamp to the filename.
     */
    public async backup(
        fileName: string | undefined = undefined,
        prefix: string | undefined = undefined,
        silent: boolean = false,
        useTimeStamp: boolean = true
    ): Promise<string | undefined> {
        const c: Commands = this;

        let fn: string = fileName || c.fileName();

        if (!fn) {
            return undefined;
        }

        let theDir: string;
        let base: string;
        let w_path: string;

        [theDir, base] = g.os_path_split(fn);

        if (useTimeStamp) {
            if (base.endsWith('.leo')) {
                base = base.slice(0, -4);
            }

            // using https://www.npmjs.com/package/date-format-lite#syntax
            // this.timeString = new Date().format("YYYYMMDD-hhmmss");

            // time.strftime("%Y%m%d-%H%M%S")
            const stamp: string = new Date().format('YYYYMMDD-hhmmss');
            const branch: string = prefix ? prefix + '-' : '';
            fn = `${branch}${base}-${stamp}.leo`;
            w_path = g.finalize_join(theDir, fn);
        } else {
            w_path = fn;
        }

        if (w_path) {
            // pylint: disable=no-member
            // Defined in commanderFileCommands.py.
            await c.saveTo(w_path, silent);
            // Issues saved message.
            // g.es('in', theDir)
        }
        return w_path;
    }
    //@+node:felix.20211223223002.4: *4* c.backup_helper
    // def backup_helper(self,
    //     base_dir=None,
    //     env_key='LEO_BACKUP',
    //     sub_dir=None,
    //     use_git_prefix=True,
    // ):
    //     """
    //     A helper for scripts that back up a .leo file.
    //     Use os.environ[env_key] as the base_dir only if base_dir is not given.
    //     Backup to base_dir or join(base_dir, sub_dir).
    //     """
    //     c = self
    //     old_cwd = os.getcwd()
    //     join = g.finalize_join
    //     if not base_dir:
    //         if env_key:
    //             try:
    //                 base_dir = os.environ[env_key]
    //             except KeyError:
    //                 print(f"No environment var: {env_key}")
    //                 base_dir = None
    //     if base_dir and g.os_path_exists(base_dir):
    //         if use_git_prefix:
    //             git_branch, junk = g.gitInfo()
    //         else:
    //             git_branch = None
    //         theDir, fn = g.os_path_split(c.fileName())
    //         backup_dir = join(base_dir, sub_dir) if sub_dir else base_dir
    //         path = join(backup_dir, fn)
    //         if g.os_path_exists(backup_dir):
    //             written_fn = c.backup(
    //                 path,
    //                 prefix=git_branch,
    //                 silent=True,
    //                 useTimeStamp=True,
    //             )
    //             g.es_print(f"wrote: {written_fn}")
    //         else:
    //             g.es_print(f"backup_dir not found: {backup_dir!r}")
    //     else:
    //         g.es_print(f"base_dir not found: {base_dir!r}")
    //     os.chdir(old_cwd)
    //@+node:felix.20211223223002.5: *4* c.checkFileTimeStamp
    /**
     * Return True if the file given by fn has not been changed
     * since Leo read it or if the user agrees to overwrite it.
     */
    public checkFileTimeStamp(fn: string): Promise<boolean> {
        const c: Commands = this;
        if (
            g.app.externalFilesController &&
            g.app.externalFilesController.check_overwrite
        ) {
            return g.app.externalFilesController.check_overwrite(c, fn);
        }
        return Promise.resolve(true);
    }
    //@+node:felix.20211223223002.6: *4* c.createNodeFromExternalFile
    /**
     * Read the file into a node.
     * Return None, indicating that c.open should set focus.
     */
    public async createNodeFromExternalFile(fn: string): Promise<void> {
        const c: Commands = this;
        let s: string | undefined;
        let e: string | undefined;
        [s, e] = await g.readFileIntoString(fn);
        if (s === undefined) {
            return;
        }
        let head: string;
        let ext: string;
        [head, ext] = g.os_path_splitext(fn);
        if (ext.startsWith('.')) {
            ext = ext.slice(1);
        }
        const language: string = g.app.extension_dict[ext];
        let prefix: string;
        if (language) {
            prefix = `@color\n@language ${language}\n\n`;
        } else {
            prefix = '@killcolor\n\n';
        }
        // pylint: disable=no-member
        // Defined in commanderOutlineCommands.py
        let p2: Position;
        p2 = c.insertHeadline('Open File', false)!;
        p2.h = `@edit ${fn}`;
        p2.b = prefix + s;
        const w = c.frame.body.wrapper;
        if (w && w.setInsertPoint) {
            w.setInsertPoint(0);
        }
        c.redraw();
        c.recolor();
    }
    //@+node:felix.20211223223002.7: *4* c.looksLikeDerivedFile
    /**
     * Return True if fn names a file that looks like an
     * external file written by Leo.
     */
    public async looksLikeDerivedFile(fn: string): Promise<boolean> {
        try {
            const w_uri = g.makeVscodeUri(fn);
            const readData = await vscode.workspace.fs.readFile(w_uri);
            const s = Buffer.from(readData).toString('utf8');
            return s.indexOf('@+leo-ver=') > -1;
        } catch (exception) {
            g.es_exception(exception);
            return false;
        }
    }
    //@+node:felix.20211223223002.8: *4* c.markAllAtFileNodesDirty
    /**
     * Mark all @file nodes as changed.
     */
    public markAllAtFileNodesDirty(): void {
        const c: Commands = this;
        c.endEditing();
        const p: Position = c.rootPosition()!;
        while (p && p.__bool__()) {
            if (p.isAtFileNode()) {
                p.setDirty();
                c.setChanged();
                p.moveToNodeAfterTree();
            } else {
                p.moveToThreadNext();
            }
        }
    }
    //@+node:felix.20211223223002.9: *4* c.markAtFileNodesDirty
    /**
     * Mark all @file nodes in the selected tree as changed.
     */
    public markAtFileNodesDirty(): void {
        const c: Commands = this;
        const p: Position = c.rootPosition()!;

        if (!p || !p.__bool__()) {
            return;
        }
        c.endEditing();
        const after: Position = p.nodeAfterTree();

        while (p && p.__bool__() && !p.__eq__(after)) {
            if (p.isAtFileNode()) {
                p.setDirty();
                c.setChanged();
                p.moveToNodeAfterTree();
            } else {
                p.moveToThreadNext();
            }
        }
    }
    //@+node:felix.20211223223002.10: *4* c.openWith
    /**
     * This is *not* a command.
     *
     * Handles the items in the Open With... menu.
     *
     * See ExternalFilesController.open_with for details about d.
     */
    // ! LEOJS DOES NOT OFFER TO OPEN IN EXTERNAL EDITOR !
    // public openWith(d?: any): void {
    //     const c: Commands = this;

    //     if (d && g.app.externalFilesController) {
    //         // Select an ancestor @<file> node if possible.
    //         if (!d['p'] || !d['p'].__bool__()) {
    //             d['p'] = undefined;
    //             const p: Position = c.p;
    //             while (p && p.__bool__()) {
    //                 if (p.isAnyAtFileNode()) {
    //                     d['p'] = p;
    //                     break;
    //                 }
    //                 p.moveToParent();
    //             }
    //         }
    //         g.app.externalFilesController.open_with(c, d);
    //     } else if (!d) {
    //         g.trace('can not happen: no d', g.callers());
    //     }
    // }
    //@+node:felix.20211223223002.11: *4* c.recreateGnxDict
    /**
     * Recreate the gnx dict prior to refreshing nodes from disk.
     */
    public recreateGnxDict(): void {
        const c: Commands = this;
        const d: { [key: string]: VNode } = {};
        // Start with the hidden-root-vnode
        const vHiddenRoot = c.hiddenRootNode;
        d[vHiddenRoot.gnx] = vHiddenRoot;
        // And fill up the with rest of the commander's VNodes.
        for (let v of c.all_unique_nodes()) {
            const gnxString: string = v.fileIndex;
            if (typeof gnxString === 'string') {
                d[gnxString] = v;
                if (g.app.debug.includes('gnx')) {
                    g.trace(c.shortFileName(), gnxString, v);
                }
            } else {
                g.internalError(`no gnx for vnode: ${v}`);
            }
        }
        c.fileCommands.gnxDict = d;
    }
    //@+node:felix.20231125172649.1: *4* c_file.openRecentFile

    // ! UNUSED IN LEOJS    

    /**
     * c.openRecentFile: This is not a command!
     *
     * This method is a helper called only from the recentFilesCallback in
     * rf.createRecentFilesMenuItems.
     */
    // public async openRecentFile(this: Commands): Promise<void>
    // const c: Commands = this;

    //     if g.doHook("recentfiles1", c=c, p=c.p, v=c.p, fileName=fn):
    //         return
    //     c2 = g.openWithFileName(fn, old_c=c)
    //     if c2:
    //         g.app.makeAllBindings()
    //         g.doHook("recentfiles2", c=c2, p=c2.p, v=c2.p, fileName=fn)

    //@+node:felix.20230730160811.1: *3* c.Git
    //@+node:felix.20230730160811.2: *4* c.diff_file
    /**
     * Create an outline describing the git diffs for all files changed
     * between rev1 and rev2.
     */
    public async diff_file(fn: string, rev1 = 'HEAD', rev2 = ''): Promise<void> {
        const x = new GitDiffController(this);
        await x.diff_file(fn, rev1, rev2);
    }
    //@+node:felix.20230730160811.3: *4* c.diff_two_revs
    /**
     * Create an outline describing the git diffs for all files changed
     * between rev1 and rev2.
     */
    public async diff_two_revs(directory?: string, rev1 = '', rev2 = ''): Promise<void> {
        await new GitDiffController(this).diff_two_revs(rev1, rev2);
    }
    //@+node:felix.20230730160811.4: *4* c.diff_two_branches
    /**
     * Create an outline describing the git diffs for all files changed
     * between rev1 and rev2.
     */
    public async diff_two_branches(branch1: any, branch2: any, fn: string): Promise<void> {
        await new GitDiffController(this).diff_two_branches(
            branch1, branch2, fn
        );
    }
    //@+node:felix.20230730160811.5: *4* c.git_diff
    public async git_diff(rev1 = 'HEAD', rev2 = ''): Promise<void> {
        await new GitDiffController(this).git_diff(rev1, rev2);
    }
    //@+node:felix.20230730160811.6: *4* c.git_node_history
    public async git_node_history(file_name: string, gnx: string): Promise<void> {
        await new GitDiffController(this).node_history(file_name, [gnx]);
    }
    //@+node:felix.20211005023225.1: *3* c.Gui
    //@+node:felix.20211122010629.1: *4* c.Dialogs & messages
    //@+node:felix.20211120224234.1: *5* c.alert
    public alert(message: string): void {
        const c: Commands = this;
        // The unit tests just tests the args.
        if (!g.unitTesting) {
            g.es(message);
            // g.app.gui.alert(c, message)
        }
    }
    //@+node:felix.20211225212807.1: *5* c.init_error_dialogs
    public init_error_dialogs(): void {
        const c: Commands = this;
        c.import_error_nodes = [];
        c.ignored_at_file_nodes = [];
        c.orphan_at_file_nodes = [];
    }
    //@+node:felix.20220611010339.1: *5* c.notValidInBatchMode
    public notValidInBatchMode(commandName: string): void {
        g.es('the', commandName, 'command is not valid in batch mode');
    }
    //@+node:felix.20231224185423.1: *5* c.putHelpFor
    /**
     * Helper for various help commands.
     */
    public putHelpFor(s: string, short_title = ''): void {
        const c = this;
        g.app.gui.put_help(c, s, short_title);
    }
    //@+node:felix.20211225212946.1: *5* c.raise_error_dialogs
    /**
     * Warn about read/write failures.
     */
    public async raise_error_dialogs(kind: string = 'read'): Promise<unknown> {
        const c: Commands = this;
        const use_dialogs = false;
        if (g.unitTesting) {
            c.init_error_dialogs();
            return;
        }
        // Issue one or two dialogs or messages.
        // Save the root's body. The dialog destroys it!
        const saved_body = c.rootPosition()!.b;
        if (
            c.import_error_nodes.length ||
            c.ignored_at_file_nodes.length ||
            c.orphan_at_file_nodes.length
        ) {
            g.app.gui.dismiss_splash_screen();
        } else {
            // #1007: Exit now, so we don't have to restore c.rootPosition().b.
            c.init_error_dialogs();
            return;
        }
        let files: string;
        if (c.import_error_nodes.length) {
            files = [...new Set(c.import_error_nodes)].sort().join('\n');
            if (!this.warnings_dict[files]) {
                this.warnings_dict[files] = true;
                const import_message1 =
                    'The following were not imported properly.';
                const import_message2 = `Inserted @ignore in...\n${files}`;
                g.es_print(import_message1);
                g.es_print(import_message2);
                if (use_dialogs) {
                    const import_dialog_message = `${import_message1}\n${import_message2}`;
                    await g.app.gui.runAskOkDialog(
                        c,
                        'Import errors',
                        import_dialog_message
                    );
                }
            }
        }
        if (c.ignored_at_file_nodes.length) {
            files = [...new Set(c.ignored_at_file_nodes)].sort().join('\n');
            if (!this.warnings_dict[files]) {
                this.warnings_dict[files] = true;
                const kind_s = kind === 'read' ? 'read' : 'written';
                const ignored_message = `The following were not ${kind_s} because they contain @ignore:`;
                kind = kind.startsWith('read') ? 'read' : 'written';
                g.es_print(ignored_message);
                g.es_print(files);
                if (use_dialogs) {
                    const ignored_dialog_message = `${ignored_message}\n${files}`;
                    await g.app.gui.runAskOkDialog(
                        c,
                        `Not ${g.capitalize(kind)}`,
                        ignored_dialog_message
                    );
                }
            }
        }
        // #1050: always raise a dialog for orphan @<file> nodes.
        if (c.orphan_at_file_nodes.length) {
            const message = [
                'The following were not written because of errors:\n',
                [...new Set(c.orphan_at_file_nodes)].sort().join('\n'),
                '',
                'Warning: changes to these files will be lost\n',
                'unless you can save the files successfully.',
            ].join('\n');
            await g.app.gui.runAskOkDialog(c, 'Not Written', message);
            // Mark all the nodes dirty.
            for (const z of c.all_unique_positions()) {
                if (z.isOrphan()) {
                    z.setDirty();
                    z.clearOrphan();
                }
            }
            c.setChanged();
            c.redraw();
        }
        // Restore the root position's body.
        c.rootPosition()!.v.b = saved_body; // #1007: just set v.b.
        c.init_error_dialogs();
    }

    //@+node:felix.20230626180727.1: *5* c.syntaxErrorDialog
    /**
     * Warn about syntax errors in files.
     */
    public async syntaxErrorDialog(): Promise<void> {
        const c: Commands = this;
        if (
            g.app.syntax_error_files &&
            g.app.syntax_error_files.length &&
            c.config.getBool('syntax-error-popup', false)
        ) {
            const aList: string[] = [
                ...new Set(g.app.syntax_error_files),
            ].sort();
            g.app.syntax_error_files = [];
            const list_s: string = aList.join('\n');
            await g.app.gui.runAskOkDialog(
                c,
                'Python Errors',
                `Python errors in:\n\n${list_s}`,
                'Ok'
            );
        }
    }

    //@+node:felix.20211022202201.1: *4* c.Drawing

    //@+node:felix.20211120225325.1: *5* c.bringToFront
    public bringToFront(c2?: Commands): void {
        const c: Commands = this;
        c2 = c2 || c;
        if (!!g.app.gui && !!g.app.gui.ensure_commander_visible) {
            g.app.gui.ensure_commander_visible(c2);
        } else {
            // TODO
            console.log('missing g.app.gui.ensure_commander_visible');
        }
    }

    // BringToFront = bringToFront  // Compatibility with old scripts
    //@+node:felix.20211022202634.1: *5* c.expandAllAncestors
    /**
     * Expand all ancestors without redrawing.
     * Return a flag telling whether a redraw is needed.
     */
    public expandAllAncestors(p_p: Position): boolean {
        let redraw_flag = false;
        for (let p of p_p.parents()) {
            if (!p.v.isExpanded()) {
                p.v.expand();
                p.expand();
                redraw_flag = true;
            } else if (p.isExpanded()) {
                p.v.expand();
            } else {
                p.expand();
                redraw_flag = true;
            }
        }
        return redraw_flag;
    }

    //@+node:felix.20211121013921.1: *5* c.outerUpdate
    /**
     * Handle delayed focus requests and modified events.
     */
    public outerUpdate(): void {
        const c: Commands = this;
        if (!c.exists || !c.k) {
            return;
        }
        // New in Leo 5.6: Delayed redraws are useful in utility methods.
        if (c.requestLaterRedraw) {
            if (c.enableRedrawFlag) {
                c.requestLaterRedraw = false;
                // if ('drawing' in g.app.debug and not g.unitTesting) {
                //     g.trace('\nDELAYED REDRAW')
                //     time.sleep(1.0)
                // }
            }
            c.redraw();
        }
        // Delayed focus requests will always be useful.
        if (c.requestedFocusWidget) {
            const w = c.requestedFocusWidget;
            if (g.app.debug.includes('focus') && !g.unitTesting) {
                let name = '';
                if (w.objectName) {
                    name = w.objectName();
                } else if (w['_name']) {
                    name = w._name;
                }
                g.trace('DELAYED FOCUS', name);
            }
            c.set_focus(w);
            c.requestedFocusWidget = undefined;
        }

        const table: [string, VNode[]][] = [
            ['childrenModified', g.childrenModifiedSet],
            ['contentModified', g.contentModifiedSet],
        ];

        for (let [kind, mods] of table) {
            if (mods.length) {
                g.doHook(kind, { c: c, nodes: mods });
                mods.length = 0;
            }
        }
    }

    //@+node:felix.20211120224224.1: *5* c.recolor
    public recolor(): void {
        // TODO
        // console.log("TODO: recolor");
    }
    //@+node:felix.20221027153010.1: *5* c.widget_name
    public widget_name(widget: StringTextWrapper): string {
        // c = self
        return g.app.gui ? g.app.gui.widget_name(widget) : '<no widget>';
    }
    //@+node:felix.20211120231934.1: *5* c.redrawing...
    //@+node:felix.20211120224229.1: *6* c.redraw
    public redraw(p?: Position): void {
        const c: Commands = this;

        if (!p || !p.__bool__()) {
            p = c.p;
        }
        if (!p || !p.__bool__()) {
            p = c.rootPosition();
        }
        if (!p || !p.__bool__()) {
            return;
        }
        c.expandAllAncestors(p);

        if (p && p.__bool__()) {
            c.selectPosition(p);
        }
    }
    //@+node:felix.20211120224231.1: *6* c.redraw_after_icons_changed
    /**
     * Update the icon for the presently selected node
     */
    // ! removed !
    // public redraw_after_icons_changed(): void {
    //     const c: Commands = this;
    //     if (c.enableRedrawFlag) {
    //         // c.frame.tree.redraw_after_icons_changed();
    //         c.redraw();
    //         // Do not call treeFocusHelper here.
    //         // c.treeFocusHelper()
    //     } else {
    //         c.requestLaterRedraw = true;
    //     }
    // }
    //@+node:felix.20211122010434.5: *6* c.redraw_after_contract
    public redraw_after_contract(p?: Position): void {
        const c: Commands = this;
        if (c.enableRedrawFlag) {
            if (p && p.__bool__()) {
                c.setCurrentPosition(p);
            } else {
                p = c.currentPosition();
            }
            //c.frame.tree.redraw_after_contract(p);
            c.redraw(p);
            c.treeFocusHelper();
        } else {
            c.requestLaterRedraw = true;
        }
    }
    //@+node:felix.20211122010434.6: *6* c.redraw_after_expand
    public redraw_after_expand(p?: Position): void {
        const c: Commands = this;
        if (c.enableRedrawFlag) {
            if (p && p.__bool__()) {
                c.setCurrentPosition(p);
            } else {
                p = c.currentPosition();
            }
            //c.frame.tree.redraw_after_expand(p);
            c.redraw(p);
            c.treeFocusHelper();
        } else {
            c.requestLaterRedraw = true;
        }
    }

    //@+node:felix.20211122010434.7: *6* c.redraw_after_head_changed
    /**
     *   Redraw the screen (if needed) when editing ends.
     *   This may be a do-nothing for some gui's.
     */
    public redraw_after_head_changed(): void {
        const c: Commands = this;
        if (c.enableRedrawFlag) {
            // this.frame.tree.redraw_after_head_changed();
            c.redraw();
        } else {
            c.requestLaterRedraw = true;
        }
    }

    //@+node:felix.20211122010434.8: *6* c.redraw_after_select
    /**
     * Redraw the screen after node p has been selected.
     */
    public redraw_after_select(p: Position): void {
        const c: Commands = this;
        let flag: boolean;
        if (c.enableRedrawFlag) {
            flag = c.expandAllAncestors(p);
            if (flag) {
                //c.frame.tree.redraw_after_select(p);
                c.redraw();
                // This is the same as c.frame.tree.full_redraw().
            }
        } else {
            c.requestLaterRedraw = true;
        }
    }

    //@+node:felix.20211122010434.9: *6* c.redraw_later
    /**
     * Ensure that c.redraw() will be called eventually.
     * c.outerUpdate will call c.redraw() only if no other code calls c.redraw().
     */
    public redraw_later(): void {
        const c: Commands = this;
        c.requestLaterRedraw = true;
        if (g.app.debug.length && g.app.debug.includes('drawing')) {
            // g.trace('\n' + g.callers(8))
            g.trace(g.callers());
        }
    }

    //@+node:felix.20211005023800.1: *4* c.Expand/contract
    //@+node:felix.20211005023821.1: *5* c.contractAllHeadlines
    /**
     * Contract all nodes in the outline.
     */
    public contractAllHeadlines(redrawFlag: boolean = true): void {
        const c: Commands = this;
        let p: Position;
        for (let v of c.all_nodes()) {
            v.contract();
            v.expandedPositions = []; // #2571
        }
        if (c.hoistStack.length) {
            // #2380: Handle hoists properly.
            let bunch = c.hoistStack[c.hoistStack.length - 1];
            p = bunch.p;
        } else {
            // Select the topmost ancestor of the presently selected node.
            p = c.p;
            while (p && p.__bool__() && p.hasParent()) {
                p.moveToParent();
            }
        }
        c.selectPosition(p); // #2380: Don't redraw here.
        c.expansionLevel = 1; // Reset expansion level.
    }

    //@+node:felix.20211005023931.1: *5* c.contractSubtree
    public contractSubtree(p: Position): void {
        for (let p_p of p.subtree()) {
            p_p.contract();
        }
    }

    //@+node:felix.20211005024008.1: *5* c.expandSubtree
    public expandSubtree(p: Position): void {
        const last = p.lastNode();
        p = p.copy();
        while (p.__bool__() && !p.__eq__(last)) {
            p.expand();
            p = p.moveToThreadNext();
        }
    }

    //@+node:felix.20211005024009.1: *5* c.expandToLevel
    public expandToLevel(level: number): void {
        const c: Commands = this;
        const n: number = c.p.level();
        const old_expansion_level = c.expansionLevel;
        let max_level = 0;
        for (let p of c.p.self_and_subtree(false)) {
            if (p.level() - n + 1 < level) {
                p.expand();
                max_level = Math.max(max_level, p.level() - n + 1);
            } else {
                p.contract();
            }
        }
        c.expansionNode = c.p.copy();
        c.expansionLevel = max_level + 1;
        if (c.expansionLevel !== old_expansion_level) {
            c.redraw();
        }
        /*
        // It's always useful to announce the level.
        // c.k.setLabelBlue('level: %s' % (max_level+1))
        // g.es('level', max_level + 1)
        c.frame.putStatusLine(f"level: {max_level + 1}")
            // bg='red', fg='red'
        */
    }

    //@+node:felix.20221026210523.1: *4* c.Focus
    //@+node:felix.20221026210523.2: *5* c.get/request/set_focus
    public get_focus(): StringTextWrapper {
        const c = this;
        const w = g.app.gui && g.app.gui.get_focus(c);
        if (g.app.debug.includes('focus')) {
            // name = w.objectName() if hasattr(w, 'objectName') else w.__class__.__name__
            const name = w['objectName'];
            g.trace('(c)', name);
            // g.trace('\n(c)',  w.__class__.__name__)
            // g.trace(g.callers(6))
        }
        return w;
    }

    public get_requested_focus(): any {
        const c = this;
        return c.requestedFocusWidget;
    }

    public request_focus(w: any): void {
        const c = this;
        if (w && g.app.gui) {
            if (g.app.debug.includes('focus')) {
                // g.trace('\n(c)', repr(w))
                const name = w['name']; // ?w['objectName'] : MyClass.name
                g.trace('(c)', name);
            }
            c.requestedFocusWidget = w;
        }
    }

    public set_focus(w: StringTextWrapper): void {
        const trace = g.app.debug.includes('focus');
        const c = this;
        if (w && g.app.gui) {
            if (trace) {
                const name = w['name'];
                // name = w.objectName(
                //     ) if hasattr(w, 'objectName') else w.__class__.__name__
                g.trace('(c)', name);
            }
            g.app.gui.set_focus(c, w);
        } else if (trace) {
            g.trace('(c) no w');
        }
        c.requestedFocusWidget = undefined;
    }
    //@+node:felix.20221026210523.3: *5* c.invalidateFocus (do nothing)
    /**
     * Indicate that the focus is in an invalid location, or is unknown.
     */
    public invalidateFocus(): void {
        // c = self
        // c.requestedFocusWidget = None
        // pass
    }
    //@+node:felix.20221026210523.4: *5* c.traceFocus (not used)
    public traceFocus(w: StringTextWrapper): void {
        const c = this;
        if (g.app.debug.includes('focus')) {
            c.trace_focus_count += 1;
            // g.pr(f"{c.trace_focus_count:4d}", c.widget_name(w), g.callers(8));
            g.pr(`${c.trace_focus_count}`);
        }
    }
    //@+node:felix.20221026210523.5: *5* c.treeFocusHelper & initialFocusHelper
    public treeFocusHelper(): void {
        const c = this;
        if (c.stayInTreeAfterSelect) {
            c.treeWantsFocus();
        } else {
            c.bodyWantsFocus();
        }
    }

    public initialFocusHelper(): void {
        const c = this;
        if (c.outlineHasInitialFocus) {
            c.treeWantsFocus();
        } else {
            c.bodyWantsFocus();
        }
    }
    //@+node:felix.20221026210523.6: *5* c.xWantsFocus
    public bodyWantsFocus(): void {
        const c = this;
        const body = c.frame.body;
        c.request_focus(body && body.wrapper);
    }
    public logWantsFocus(): void {
        g.app.gui.showLogPane(true);
        // const c = this;
        // const log = c.frame.log;
        // c.request_focus(log && log.logCtrl);
    }
    // * No use in LeoJS
    // public minibufferWantsFocus(): void {
    //     const c = this;
    //     c.request_focus(c.miniBufferWidget);
    // }
    public treeWantsFocus(): void {
        const c = this;
        const tree = c.frame.tree;
        c.request_focus(tree && tree.canvas);
    }
    public widgetWantsFocus(w: any): void {
        const c = this;
        c.request_focus(w);
    }
    //@+node:felix.20221026210523.7: *5* c.xWantsFocusNow
    // widgetWantsFocusNow does an automatic update.

    public widgetWantsFocusNow(w: any): void {
        const c = this;
        if (w) {
            c.set_focus(w);
            c.requestedFocusWidget = undefined;
        }
    }

    // New in 4.9: all FocusNow methods now *do* call c.outerUpdate().

    public bodyWantsFocusNow(): void {
        const c = this;
        const body = this.frame.body;
        c.widgetWantsFocusNow(body && body.wrapper);
    }

    public logWantsFocusNow(): void {
        // const c = this;
        // const log = this.frame.log;
        // c.widgetWantsFocusNow(log && log.logCtrl);
        g.app.gui.showLogPane(true);
    }

    // * No use in LeoJS
    // public minibufferWantsFocusNow(): void {
    //     const c = this;
    //     c.widgetWantsFocusNow(c.miniBufferWidget);
    // }

    public treeWantsFocusNow(): void {
        const c = this;
        const tree = this.frame.tree;
        c.widgetWantsFocusNow(tree && tree.canvas);
    }
    //@+node:felix.20211023195447.1: *4* c.Menus
    //@+node:felix.20211023195447.3: *5* c.Menu Enablers
    //@+node:felix.20211023195447.4: *6* c.canClone
    public canClone(): boolean {
        const c: Commands = this;
        if (c.hoistStack.length) {
            const current: Position = c.p;
            const bunch = c.hoistStack[c.hoistStack.length - 1];
            return !current.__eq__(bunch.p);
        }
        return true;
    }
    //@+node:felix.20211023195447.5: *6* c.canContractAllHeadlines
    /**
     * Returns true if any node is not contracted
     */
    public canContractAllHeadlines(): boolean {
        const c: Commands = this;
        for (let p of c.all_positions()) {
            // was c.all_unique_positions()
            if (p.isExpanded()) {
                return true;
            }
        }
        return false;
    }

    //@+node:felix.20211023195447.6: *6* c.canContractAllSubheads
    public canContractAllSubheads(): boolean {
        const current: Position = this.p;
        for (let p of current.subtree()) {
            if (!p.__eq__(current) && p.isExpanded()) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20211023195447.7: *6* c.canContractParent
    public canContractParent(): boolean {
        const c: Commands = this;
        return c.p.parent().__bool__();
    }
    //@+node:felix.20211023195447.8: *6* c.canContractSubheads
    public canContractSubheads(): boolean {
        const current: Position = this.p;
        for (let child of current.children()) {
            if (child.isExpanded()) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20211023195447.9: *6* c.canCutOutline & canDeleteHeadline
    public canDeleteHeadline(): boolean {
        const c: Commands = this;
        let p: Position = c.p;
        if (c.hoistStack.length) {
            const bunch = c.hoistStack[0];
            if (p && p.__bool__() && p.__eq__(bunch.p)) {
                return false;
            }
        }
        return p.hasParent() || p.hasThreadBack() || !!p.hasNext();
    }
    // canCutOutline = canDeleteHeadline

    //@+node:felix.20211023195447.10: *6* c.canDemote
    public canDemote(): boolean {
        const c: Commands = this;
        return !!c.p.hasNext();
    }
    //@+node:felix.20211023195447.11: *6* c.canExpandAllHeadlines
    /**
     * Return true if the Expand All Nodes menu item should be enabled.
     */
    public canExpandAllHeadlines(): boolean {
        const c: Commands = this;
        for (let p of c.all_positions()) {
            // was c.all_unique_positions()
            if (!p.isExpanded()) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20211023195447.12: *6* c.canExpandAllSubheads
    public canExpandAllSubheads(): boolean {
        const c: Commands = this;
        for (let p of c.p.subtree()) {
            if (!p.isExpanded()) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20211023195447.13: *6* c.canExpandSubheads
    public canExpandSubheads(): boolean {
        const current: Position = this.p;
        for (let p of current.children()) {
            if (!p.__eq__(current) && !p.isExpanded()) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20211023195447.14: *6* c.canExtract, canExtractSection & canExtractSectionNames
    public canExtract(): boolean {
        const c: Commands = this;
        const w = c.frame.body.wrapper;
        return w && w.hasSelection();
    }
    public canExtractSection(): boolean {
        const c: Commands = this;
        const w = c.frame.body.wrapper;
        if (!w) {
            return false;
        }
        const s: string = w.getSelectedText();
        if (!s) {
            return false;
        }
        const line: string = g.get_line(s, 0);
        const i1 = line.indexOf('<<');
        const j1 = line.indexOf('>>');
        const i2 = line.indexOf('@<');
        const j2 = line.indexOf('@>');
        return (-1 < i1 && i1 < j1) || (-1 < i2 && i2 < j2);
    }
    //@+node:felix.20211023195447.15: *6* c.canFindMatchingBracket
    public canFindMatchingBracket(): boolean {
        const c: Commands = this;
        const brackets: string = '()[]{}';
        const w = c.frame.body.wrapper;
        const s = w.getAllText();
        const ins: number = w.getInsertPoint();

        const c1 = ins < s.length ? s[ins] : '';

        const c2 = 0 <= ins - 1 && ins - 1 < s.length ? s[ins - 1] : '';

        const val =
            (c1 && brackets.includes(c1)) || (c2 && brackets.includes(c2));
        return !!val;
    }
    //@+node:felix.20211023195447.16: *6* c.canHoist & canDehoist
    /**
     * Return true if do-hoist should be enabled in a menu.
     * Should not be used in any other context.
     */
    public canDehoist(): boolean {
        const c: Commands = this;
        return !!c.hoistStack.length;
    }
    /**
     * Return true if hoist should be enabled in a menu.
     * Should not be used in any other context.
     */
    public canHoist(): boolean {
        // This is called at idle time, so minimizing positions is crucial!
        return true;
    }

    //@+node:felix.20211023195447.17: *6* c.canMoveOutlineDown
    public canMoveOutlineDown(): boolean {
        const c: Commands = this;
        const p: Position = this.p;
        const next = p.visNext(c);
        return p && p.__bool__() && !!next && next.__bool__();
    }
    //@+node:felix.20211023195447.18: *6* c.canMoveOutlineLeft
    public canMoveOutlineLeft(): boolean {
        const c: Commands = this;
        const p: Position = this.p;
        if (c.hoistStack.length) {
            const bunch = c.hoistStack[c.hoistStack.length - 1];
            if (p && p.__bool__() && p.hasParent()) {
                p.moveToParent();
                return !p.__eq__(bunch.p) && bunch.p.isAncestorOf(p);
            }
            return false;
        }
        return p && p.__bool__() && p.hasParent();
    }
    //@+node:felix.20211023195447.19: *6* c.canMoveOutlineRight
    public canMoveOutlineRight(): boolean {
        const c: Commands = this;
        const p: Position = this.p;
        if (c.hoistStack.length) {
            const bunch = c.hoistStack[c.hoistStack.length - 1];
            return p && p.__bool__() && p.hasBack() && !p.__eq__(bunch.p);
        }
        return p && p.__bool__() && p.hasBack();
    }
    //@+node:felix.20211023195447.20: *6* c.canMoveOutlineUp
    public canMoveOutlineUp(): boolean {
        const c: Commands = this;
        const current: Position = this.p;
        const visBack: Position | undefined | false =
            !!current && !!current.__bool__() && current.visBack(c);
        if (!visBack || !visBack.__bool__()) {
            return false;
        }
        if (visBack.visBack(c)?.__bool__()) {
            return true;
        }
        if (c.hoistStack.length) {
            // limit, limitIsVisible = c.visLimit()
            let w_vis: [Position | undefined, boolean | undefined] =
                c.visLimit();
            let limitIsVisible: boolean;
            let limit: Position | undefined;
            if (w_vis) {
                limit = w_vis[0];
                limitIsVisible = !!w_vis[1];
            } else {
                limitIsVisible = false;
            }

            if (limitIsVisible && limit) {
                // A hoist
                return !current.__eq__(limit);
            }
            // A chapter.
            return !!limit && !current.__eq__(limit.firstChild());
        }
        const w_root: Position | undefined = c.rootPosition();
        return !!w_root && w_root!.__bool__() && !current.__eq__(w_root!);
    }
    //@+node:felix.20211023195447.21: *6* c.canPasteOutline
    public canPasteOutline(s: string): boolean {
        // check for JSON
        if (s && s.trimStart().startsWith('{')) {
            try {
                const d = JSON.parse(s);
                if (!(d['vnodes'] && d['tnodes'])) {
                    return false;
                }
            } catch (exception) {
                return false;
            }
            return true;
        }
        if (s && g.match(s, 0, g.app.prolog_prefix_string)) {
            return true;
        }
        return false;
    }
    //@+node:felix.20211023195447.22: *6* c.canPromote
    public canPromote(): boolean {
        const p: Position = this.p;
        return p && p.__bool__() && p.hasChildren();
    }
    //@+node:felix.20211023195447.23: *6* c.canSelect....
    public canSelectThreadBack(): boolean {
        const p: Position = this.p;
        return p.hasThreadBack();
    }
    public canSelectThreadNext(): boolean {
        const p: Position = this.p;
        return p.hasThreadNext();
    }
    public canSelectVisBack(): boolean {
        const c: Commands = this;
        const p: Position = this.p;
        const back = p.visBack(c);
        return !!back && back.__bool__();
    }
    public canSelectVisNext(): boolean {
        const c: Commands = this;
        const p: Position = this.p;
        const next = p.visNext(c);
        return !!next && next.__bool__();
    }
    //@+node:felix.20211023195447.24: *6* c.canShiftBodyLeft/Right
    public canShiftBodyLeft(): boolean {
        const c: Commands = this;
        const w = c.frame.body.wrapper;
        return w && !!w.getAllText();
    }
    //@+node:felix.20211023195447.25: *6* c.canSortChildren, canSortSiblings
    public canSortChildren(): boolean {
        const p: Position = this.p;
        return p && p.__bool__() && p.hasChildren();
    }
    public canSortSiblings(): boolean {
        const p: Position = this.p;
        return p && p.__bool__() && (p.hasNext() || p.hasBack());
    }
    //@+node:felix.20211023195447.26: *6* c.canUndo & canRedo
    public canUndo(): boolean {
        const c: Commands = this;
        return c.undoer.canUndo();
    }
    public canRedo(): boolean {
        const c: Commands = this;
        return c.undoer.canRedo();
    }
    //@+node:felix.20211023195447.27: *6* c.canUnmarkAll
    public canUnmarkAll(): boolean {
        const c: Commands = this;
        for (let p of c.all_unique_positions()) {
            if (p.isMarked()) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20211023195447.28: *6* Slow routines: no longer used
    //@+node:felix.20211023195447.29: *7* c.canGoToNextDirtyHeadline (slow)
    public canGoToNextDirtyHeadline(): boolean {
        const c: Commands = this;
        const current: Position = this.p;
        for (let p of c.all_unique_positions()) {
            if (!p.__eq__(current) && p.isDirty()) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20211023195447.30: *7* c.canGoToNextMarkedHeadline (slow)
    public canGoToNextMarkedHeadline(): boolean {
        const c: Commands = this;
        const current: Position = this.p;
        for (let p of c.all_unique_positions()) {
            if (!p.__eq__(current) && p.isMarked()) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20211023195447.31: *7* c.canMarkChangedHeadline (slow)
    public canMarkChangedHeadlines(): boolean {
        const c: Commands = this;
        for (let p of c.all_unique_positions()) {
            if (p.isDirty()) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20211023195447.32: *7* c.canMarkChangedRoots (slow)
    public canMarkChangedRoots(): boolean {
        const c: Commands = this;
        for (let p of c.all_unique_positions()) {
            if (p.isDirty() && p.isAnyAtFileNode()) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20211005023421.1: *4* c.Selecting
    //@+node:felix.20221231011907.1: *5* c.endEditing
    /**
     * End the editing of a headline.
     */
    public endEditing(): void {
        const c = this;
        const p = c.p;
        if (p && p.__bool__()) {
            c.frame.tree.endEditLabel();
        }
    }
    //@+node:felix.20211031215315.1: *5* c.redrawAndEdit
    /**
     * Redraw the screen and edit p's headline.
     */
    public redrawAndEdit(
        p: Position,
        selectAll: boolean = false,
        selection: any = undefined,
        keepMinibuffer: boolean = false
    ): Thenable<Position> {
        const c: Commands = this;
        const k: any = this.k;
        c.redraw(p); // This *must* be done now.
        if (p && p.__bool__()) {
            // This should request focus.
            // c.frame.tree.editLabel(p, selectAll, selection);
            return g.app.gui.editHeadline();

            // if (k && !keepMinibuffer) {
            //     // Setting the input state has no effect on focus.
            //     if (selectAll) {
            //         k.setInputState('insert');
            //     } else {
            //         k.setDefaultInputState();
            //     }
            //     // This *does* affect focus.
            //     k.showStateAndMode();
            // }
        } else {
            g.trace('** no p');
            return Promise.resolve(p);
        }
        // Update the focus immediately.
        // if (!keepMinibuffer) {
        //     c.outerUpdate();
        // }
    }
    //@+node:felix.20211005023456.1: *5* c.selectPosition
    /**
     * Select a new position, redrawing the screen *only* if we must
     * change chapters.
     */
    public selectPosition(p: Position): void {
        const trace = false; // For # 2167.
        const c: Commands = this;
        const cc: ChapterController = c.chapterController;

        if (!p || !p.__bool__()) {
            if (!g.app.batchMode) {
                // A serious error.
                g.trace('Warning: no p', g.callers());
            }
        }

        if (cc && !cc.selectChapterLockout) {
            cc.selectChapterForPosition(p);
            // Calls c.redraw only if the chapter changes.
        }

        // De-hoist as necessary to make p visible.
        if (c.hoistStack.length) {
            while (c.hoistStack.length) {
                let bunch = c.hoistStack[c.hoistStack.length - 1];
                if (c.positionExists(p, bunch.p)) {
                    break;
                } else {
                    if (trace) {
                        // TODO
                        // command_name = c.command_name if c.inCommand else 'None'
                        // print('')
                        // print('pop hoist stack! callers:', g.callers())
                        // g.printObj(c.hoistStack, tag='c.hoistStack before pop')
                        // print(f"c.command_name: {command_name}")
                        // print('lossage')
                        // for i, data in enumerate(reversed(g.app.lossage)):
                        //     print(f"{i:>2} {data!r}")
                    }
                    bunch = c.hoistStack.pop()!;
                }
            }
        }

        c.frame.tree.select(p);

        c.setCurrentPosition(p);
    }

    //@+node:felix.20211022013445.1: *5* c.treeSelectHelper
    public treeSelectHelper(p: Position | false): void {
        const c: Commands = this;
        if (!p || !p.__bool__()) {
            p = c.p;
        }
        if (p && p.__bool__()) {
            // Do not call expandAllAncestors here.
            c.selectPosition(p);
            c.redraw_after_select(p);
        }
        c.treeFocusHelper(); // This is essential.
    }

    //@+node:felix.20220210211453.1: *3* c.Scripting utils
    //@+node:felix.20230403205855.1: *4* c.registerCommand
    /**
     * Equivalent of c.k.registerCommand from leoKeys.py.
     */
    public registerCommand(
        commandName: string,
        func: (...args: any[]) => any,
        allowBinding = false,
        pane = 'all',
        shortcut?: string
    ): void {
        const c = this;
        if (!func) {
            g.es_print('Null func passed to k.registerCommand\n', commandName);
            return;
        }
        const f: (...args: any[]) => any & { __doc__: string } & {
            __func_name__: string;
        } & {
            __name__: string;
        } & { __ivars__: string[] } = c.commandsDict[commandName];

        if (f && (f as any)['__name__'] !== (func as any)['__name__']) {
            g.trace('redefining', commandName, f, '->', func);
        }
        c.commandsDict[commandName] = func;
    }
    //@+node:felix.20221014000217.1: *4* c.cloneFindByPredicate
    /**
     * Traverse the tree given using the generator, cloning all positions for
     * which predicate(p) is True. Undoably move all clones to a new node, created
     * as the last top-level node. Returns the newly-created node. Arguments:
     *
     * generator,      The generator used to traverse the tree.
     * predicate,      A function of one argument p returning true if p should be included.
     * failMsg=None,   Message given if nothing found. Default is no message.
     * flatten=False,  True: Move all node to be parents of the root node.
     * iconPath=None,  Full path to icon to attach to all matches.
     * undo_type=None, The undo/redo name shown in the Edit:Undo menu.
                        The default is 'clone-find-predicate'
     */
    public cloneFindByPredicate(
        generator: (copy?: boolean) => Generator<Position, any, unknown>, // The generator used to traverse the tree.
        predicate: (p: Position) => boolean, // A function of one argument p, returning True  // if p should be included in the results.
        failMsg: string = '', // Failure message. Default is no message.
        flatten: boolean = false, // True: Put all matches at the top level.
        iconPath: string = '', // Full path to icon to attach to all matches.
        undoType: string = '' // The undo name, shown in the Edit:Undo menu.  // The default is 'clone-find-predicate'
    ): Position | undefined {
        const c = this;
        const u = c.undoer;
        undoType = undoType || 'clone-find-predicate';

        const clones: Position[] = [];
        let root: Position | undefined;
        const seen: VNode[] = []; // a set

        for (let p of generator()) {
            if (predicate(p) && !seen.includes(p.v)) {
                c.setCloneFindByPredicateIcon(iconPath, p);
                if (flatten) {
                    if (!seen.includes(p.v)) {
                        seen.push(p.v);
                    }
                } else {
                    for (let p2 of p.self_and_subtree(false)) {
                        if (!seen.includes(p2.v)) {
                            seen.push(p2.v);
                        }
                    }
                }
                clones.push(p.copy());
            }
        }
        if (clones.length) {
            const undoData = u.beforeInsertNode(c.p);
            root = c.createCloneFindPredicateRoot(flatten, undoType);
            for (let p of clones) {
                // Create the clone directly as a child of found.
                const p2 = p.copy();
                const n = root.numberOfChildren();
                p2._linkCopiedAsNthChild(root, n);
            }
            u.afterInsertNode(root, undoType, undoData);
            c.selectPosition(root);
            c.setChanged();
            c.contractAllHeadlines();
            root.expand();
        } else if (failMsg) {
            g.es(failMsg);
        }
        return root;
    }
    //@+node:felix.20221014000217.2: *5* c.setCloneFindByPredicateIcon
    /**
     * Attach an icon to p.v.u.
     */
    public setCloneFindByPredicateIcon(iconPath: any, p: Position): void {
        // ? needed ?
        // if (iconPath && g.os_path_exists(iconPath) && !g.os_path_isdir(iconPath)){
        //     const aList = p.v.u['icons'] || [];
        //     let w_break = false;
        //     for (let d of aList){
        //         if (d['file'] === iconPath){
        //             w_break = true;
        //             break;
        //         }
        //     }
        //     if(!w_break){
        //         aList.push({
        //             'type': 'file',
        //             'file': iconPath,
        //             'on': 'VNode',
        //             // 'relPath': iconPath,
        //             'where': 'beforeHeadline',
        //             'xoffset': 2, 'xpad': 1,
        //             'yoffset': 0
        //         })
        //         p.v.u['icons'] = aList;
        //     }
        // }else if(iconPath){
        //     g.trace('bad icon path', iconPath);
        // }
    }

    //@+node:felix.20221014000217.3: *5* c.createCloneFindPredicateRoot
    /**
     * Create a root node for clone-find-predicate.
     */
    public createCloneFindPredicateRoot(
        flatten: boolean,
        undoType: string
    ): Position {
        const c: Commands = this;

        const root = c.lastTopLevel().insertAfter();
        root.h = undoType + (flatten ? ' (flattened)' : '');
        return root;
    }
    //@+node:felix.20220210211517.1: *4* c.deletePositionsInList
    /**
     * Delete all vnodes corresponding to the positions in aList.
     *
     * Set c.p if the old position no longer exists.
     *
     * See "Theory of operation of c.deletePositionsInList" in LeoDocs.leo.
     */
    public deletePositionsInList(
        aList: Position[]
    ): [string, number, string][] {
        // New implementation by Vitalije 2020-03-17 17:29
        const c: Commands = this;

        // Ensure all positions are valid.
        aList = aList.filter((p) => {
            return c.positionExists(p);
        });

        if (!aList.length) {
            return [];
        }

        function p2link(p: Position): [number, VNode] {
            const parent_v: VNode = p.stack.length
                ? p.stack[p.stack.length - 1][0]
                : c.hiddenRootNode;
            return [p._childIndex, parent_v];
        }

        let links_to_be_cut = [...aList.map(p2link, aList)];
        let unique_links: [number, VNode][] = [];
        // links_to_be_cut = [...new Set(links_to_be_cut)]; // Make unique
        links_to_be_cut.forEach((fromElement) => {
            let i: number;
            let v: VNode;
            [i, v] = fromElement;
            let found = false;
            unique_links.forEach((toElement) => {
                let j: number;
                let w: VNode;
                [j, w] = toElement;
                if (i === j && v === w) {
                    found = true;
                }
            });
            if (!found) {
                unique_links.push(fromElement); // add if not found
            }
        });
        links_to_be_cut = unique_links.sort((a, b): number => {
            return a[0] < b[0] ? 1 : -1;
        });

        const undodata: [string, number, string][] = [];
        links_to_be_cut.forEach((element) => {
            let i: number;
            let v: VNode;
            [i, v] = element;
            const ch = v.children[i]; // get item
            v.children.splice(i, 1); // remove it from children
            const index = ch.parents.indexOf(v); // find index in parents
            if (index >= 0) {
                ch.parents.splice(index, 1); // remove it from parents
            }
            undodata.push([v.gnx, i, ch.gnx]);
        });

        if (!c.positionExists(c.p)) {
            c.selectPosition(c.rootPosition()!);
        }
        return undodata;
    }
    //@+node:felix.20230525222516.1: *4* c.find_b & find_h
    //@+node:felix.20230525222516.2: *5* c.find_b
    /**
     * Return list of all Positions whose body matches the regex at least once.
     */
    public find_b(
        regex: RegExp,
        flags = 'ig',
        it?: Generator<Position, any, unknown> | Position[]
    ): Position[] {
        const c = this;

        if (!flags.includes('g')) {
            flags = flags + 'g';
        }

        function* reFindIter(
            pattern: RegExp,
            text: string
        ): IterableIterator<any> {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                yield match;
            }
        }

        if (it == null) {
            it = c.all_positions();
        }
        try {
            const pattern = new RegExp(regex, flags);
            return [...it]
                .filter((p) =>
                    [...reFindIter(pattern, p.b)].some(
                        (m: RegExpExecArray) => m
                    )
                )
                .map((p) => p.copy());

            // return [p.copy() for p in it if any(m for m in re.finditer(pattern, p.b))];
        } catch (exception) {
            g.es_error('Exception in c.find_b');
            g.es_exception(exception);
            return [];
        }
    }
    //@+node:felix.20230525222516.3: *5* c.find_h
    /**
     *  Return list of all Positions whose headline matches the regex.
     */
    public find_h(
        regex: RegExp,
        flags = 'i',
        it?: Generator<Position, any, unknown> | Position[]
    ): Position[] {
        const c = this;

        if (!flags.includes('g')) {
            flags = flags + 'g';
        }

        if (it == null) {
            it = c.all_positions();
        }
        try {
            const pattern = new RegExp(regex, flags);
            return [...it]
                .filter((z) => pattern.test(z.h))
                .map((z) => z.copy());
            // return [z.copy() for z in it if re.match(pattern, z.h)];
        } catch (exception) {
            g.es_error('Exception in c.find_h');
            g.es_exception(exception);
            return [];
        }
    }
    //@+node:felix.20240601145220.1: *4* c.undoableDeletePositions
    /**
     * Deletes all vnodes corresponding to the positions in aList,
     * and make changes undoable.
     */
    public undoableDeletePositions(aList: Position[]): void {

        const c = this;
        const u = c.undoer;
        const data = c.deletePositionsInList(aList);
        const gnx2v = c.fileCommands.gnxDict;

        function undo(): void {
            const bead = u.getBead(u.bead);
            if (!bead) { return; }
            for (const [pgnx, i, chgnx] of bead.data.reverse()) {
                const v = gnx2v[pgnx];
                const ch = gnx2v[chgnx];
                v.children.splice(i, 0, ch);
                ch.parents.push(v);
            }
            if (!c.positionExists(c.p)) {
                c.setCurrentPosition(c.rootPosition()!);
            }
        }

        function redo(): void {
            const bead = u.getBead(u.bead + 1);
            if (!bead) { return; }
            for (const [pgnx, i, _chgnx] of bead.data) {
                const v = gnx2v[pgnx];
                const ch = v.children.splice(i, 1)[0];
                ch.parents = ch.parents.filter(parent => parent !== v);
            }
            if (!c.positionExists(c.p)) {
                c.setCurrentPosition(c.rootPosition()!);
            }
        }

        u.pushBead({
            data: data,
            undoType: 'delete nodes',
            undoHelper: undo,
            redoHelper: redo,
        });
    }
    //@+node:felix.20220605203342.1: *3* c.Settings
    //@+node:felix.20220605203342.2: *4* c.registerReloadSettings
    public registerReloadSettings(obj: any): void {
        const c: Commands = this;

        if (!c.configurables.includes(obj)) {
            c.configurables.push(obj);
        }
    }

    //@+node:felix.20220605203342.3: *4* c.reloadConfigurableSettings
    /**
     * Call all reloadSettings method in c.subcommanders, c.configurables and
     * other known classes.
     */
    public reloadConfigurableSettings(): void {
        const c = this;

        // * LEOJS: some are non-existant
        const table = [
            g.app.gui,
            g.app.pluginsController,
            // c.k.autoCompleter,
            c.frame,
            c.frame.body,
            // c.frame.log,
            c.frame.tree,
            // c.frame.body.colorizer,
            // (c.frame.body.colorizer as any).highlighter || null,
        ];
        for (const obj of table) {
            if (obj) {
                c.registerReloadSettings(obj);
            }
        }
        // Useful now that instances add themselves to c.configurables.
        c.configurables = Array.from(new Set(c.configurables));
        c.configurables.sort((a, b) => a.constructor.name.toLowerCase().localeCompare(b.constructor.name.toLowerCase()));

        for (const obj of c.configurables) {
            if (obj == null) {
                g.es_print('Undefined object in c.configurables');
                continue;
            }
            const func = (
                (obj as any).reloadSettings
                || (obj as any).reload_settings  // An official alias.
            );
            if (func) {
                try {
                    func.bind(obj)();
                    g.doHook("after-reload-settings", { c: c });
                } catch (e) {
                    g.es_exception(e);
                    c.configurables = c.configurables.filter(item => item !== obj);
                }
            }
        }

    }

    //@-others
}

//@-others
//@@language typescript
//@@tabwidth -4

export interface Commands
    extends CommanderOutlineCommands,
    CommanderFileCommands,
    CommanderHelpCommands,
    CommanderEditCommands,
    TopLevelCompareCommands,
    TopLevelImportCommands,
    TopLevelPersistanceCommands,
    TopLevelSessionsCommands,
    TopLevelEditCommands {
    canCutOutline: () => boolean;
    canShiftBodyRight: () => boolean;
    canExtractSectionNames: () => boolean;
    BringToFront: () => void;
    currentVnode: () => Position | undefined;
    rootVnode: () => Position | undefined;
    findRootPosition: () => Position | undefined;
    topVnode: () => void;
    setTopVnode: (p: Position) => void;
    all_vnodes_iter: () => Generator<VNode, any, unknown>;
    all_unique_vnodes_iter: () => Generator<VNode, any, unknown>;
    all_positions_iter: () => Generator<Position, any, unknown>;
    allNodes_iter: () => Generator<Position, any, unknown>;
    safe_all_positions: () => Generator<Position, any, unknown>;
    all_positions_with_unique_vnodes_iter: () => Generator<
        Position,
        any,
        unknown
    >;
    setCurrentVnode: (p: Position) => void;
    force_redraw: () => void;
    redraw_now: () => void;
}

// Apply the mixins into the base class via
// the JS at runtime & aliases for VNode members

applyMixins(Commands, [
    CommanderOutlineCommands,
    CommanderFileCommands,
    CommanderHelpCommands,
    CommanderEditCommands,
    TopLevelCompareCommands,
    TopLevelImportCommands,
    TopLevelPersistanceCommands,
    TopLevelSessionsCommands,
    TopLevelEditCommands,
]);
Commands.prototype.canCutOutline = Commands.prototype.canDeleteHeadline;
Commands.prototype.canShiftBodyRight = Commands.prototype.canShiftBodyLeft;
Commands.prototype.canExtractSectionNames = Commands.prototype.canExtract;
Commands.prototype.BringToFront = Commands.prototype.bringToFront;
Commands.prototype.currentVnode = Commands.prototype.currentPosition;
Commands.prototype.rootVnode = Commands.prototype.rootPosition;
Commands.prototype.findRootPosition = Commands.prototype.rootPosition;
Commands.prototype.topVnode = Commands.prototype.topPosition;
Commands.prototype.setTopVnode = Commands.prototype.setTopPosition;
Commands.prototype.all_vnodes_iter = Commands.prototype.all_nodes;
Commands.prototype.all_unique_vnodes_iter = Commands.prototype.all_unique_nodes;
Commands.prototype.all_positions_iter = Commands.prototype.all_positions;
Commands.prototype.allNodes_iter = Commands.prototype.all_positions;
Commands.prototype.safe_all_positions = Commands.prototype.all_positions;
Commands.prototype.all_positions_with_unique_vnodes_iter =
    Commands.prototype.all_unique_positions;
Commands.prototype.setCurrentVnode = Commands.prototype.setCurrentPosition;
Commands.prototype.force_redraw = Commands.prototype.redraw;
Commands.prototype.redraw_now = Commands.prototype.redraw;

//@-leo
