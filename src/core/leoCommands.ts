//@+leo-ver=5-thin
//@+node:felix.20210110222544.1: * @file src/core/leoCommands.ts
//@+<< imports >>
//@+node:felix.20210220194059.1: ** << imports >>
import * as g from './leoGlobals';
import { LeoUI } from '../leoUI';
import { FileCommands } from "./leoFileCommands";
import { CommanderOutlineCommands } from "../commands/commanderOutlineCommands";
import { CommanderFileCommands } from "../commands/commanderFileCommands";

import { Position, VNode, StackEntry } from "./leoNodes";
import { NodeHistory } from './leoHistory';

//@-<< imports >>
//@+others
//@+node:felix.20211017232128.1: ** applyMixins
function applyMixins(derivedCtor: any, constructors: any[]) {
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

//@+node:felix.20210224000242.1: ** interface hoistStack
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

    public hiddenRootNode: VNode;
    public fileCommands: FileCommands;
    public chapterController: any; // TODO : leoChapters.ChapterController(c)
    public undoer: any; // TODO : leoUndo.Undoer(c)
    public nodeHistory: NodeHistory;

    public gui: LeoUI;

    // TODO fake frame needed FOR wrapper and hasSelection 
    // TODO : maybe MERGE frame.tree.generation WITH _treeId?
    public frame: { tree: { generation: number; }, body: any } = {
        tree: {
            generation: 0
        },
        body: {}
    };

    //@+others
    //@+node:felix.20210223220756.1: *3* Commander IVars
    //@+node:felix.20211021003423.1: *4* c.initConfigSettings
    public collapse_on_lt_arrow: boolean = true; // getBool('collapse-on-lt-arrow', default=True)
    //@+node:felix.20210223220814.2: *4* c.initCommandIvars
    // Init ivars used while executing a command.
    public commandsDict: { [key: string]: (p?: any) => any } = {}; // Keys are command names, values are functions.
    public disableCommandsMessage: string = ''; // The presence of this message disables all commands.
    public hookFunction: any = undefined; // One of three places that g.doHook looks for hook functions.

    public ignoreChangedPaths = false; // True: disable path changed message in at.WriteAllHelper.
    public inCommand: boolean = false; // Interlocks to prevent premature closing of a window.
    public isZipped: boolean = false; // Set by g.openWithFileName.
    public outlineToNowebDefaultFileName: string = "noweb.nw"; // For Outline To Noweb dialog.

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

    public sqlite_connection: any = undefined;

    //@+node:felix.20210223220814.3: *4* c.initDebugIvars
    // Init Commander debugging ivars.
    public command_count: number = 0;
    public scanAtPathDirectivesCount: number = 0;
    public trace_focus_count: number = 0;

    //@+node:felix.20210223220814.4: *4* c.initDocumentIvars
    // Init per-document ivars.
    public expansionLevel: number = 0; // The expansion level of this outline.
    public expansionNode: Position | undefined = undefined; // The last node we expanded or contracted.
    public nodeConflictList: VNode[] = []; // List of nodes with conflicting read-time data.
    public nodeConflictFileName: string | undefined = undefined; // The fileName for c.nodeConflictList.
    public user_dict = {}; // Non-persistent dictionary for free use by scripts and plugins.

    //@+node:felix.20210223220814.5: *4* c.initEventIvars
    // Init ivars relating to gui events.
    public configInited = false;
    public doubleClickFlag = false;
    public exists = true; // Indicate that this class exists and has not been destroyed.

    public in_qt_dialog = false; // True: in a qt dialog.
    public loading = false; // True: we are loading a file: disables c.setChanged()
    public promptingForClose = false; // True: lock out additional closing dialogs.
    public suppressHeadChanged = false; // True: prevent setting c.changed when switching chapters.
    // Flags for c.outerUpdate...
    public enableRedrawFlag = true;
    public requestCloseWindow = false;
    public requestedFocusWidget = undefined;
    public requestLaterRedraw = false;

    //@+node:felix.20210223220814.6: *4* c.initFileIvars
    // Init file-related ivars of the commander.
    public changed = false; // True: the ouline has changed since the last save.
    public ignored_at_file_nodes: string[] = []; // (headers)
    public import_error_nodes: string[] = []; // List of nodes for c.raise_error_dialogs. (headers)
    public last_dir: string | undefined = undefined; // The last used directory.
    public mFileName: string = ''; // Do _not_ use os_path_norm: it converts an empty path to '.' (!!)
    public mRelativeFileName: string = '';
    public openDirectory: string | undefined = undefined;
    public orphan_at_file_nodes: string[] = []; // List of orphaned nodes for c.raise_error_dialogs. (headers)
    public wrappedFileName: string | undefined = undefined; // The name of the wrapped file, for wrapper commanders, set by LM.initWrapperLeoFile

    //@+node:felix.20210223220814.7: *4* c.initOptionsIvars
    // Init Commander ivars corresponding to user options.
    public fixed: boolean = false;
    public fixedWindowPosition = [];
    public forceExecuteEntireBody: boolean = false;
    public focus_border_color: string = 'white';
    public focus_border_width: number = 1;  // pixels;
    public outlineHasInitialFocus: boolean = false;
    public page_width: number = 132;
    public sparse_find: boolean = true;
    public sparse_move: boolean = true;
    public sparse_spell: boolean = true;
    public stayInTreeAfterSelect: boolean = false;
    public tab_width: number = -4;
    public tangle_batch_flag: boolean = false;
    public target_language: string = "python"; // TODO : switch to js for Leojs?
    public untangle_batch_flag: boolean = false;
    // # self.use_body_focus_border = True
    // # self.use_focus_border = False
    // # Replaced by style-sheet entries.
    public vim_mode: boolean = false;

    //@+node:felix.20210223220814.8: *4* c.initObjectIvars
    // These ivars are set later by leoEditCommands.createEditCommanders
    public abbrevCommands: any = undefined;
    public editCommands: any = undefined;
    public db: any = {};  // May be set to a PickleShare instance later.
    public bufferCommands: any = undefined;
    public chapterCommands: any = undefined;
    public controlCommands: any = undefined;
    public convertCommands: any = undefined;
    public debugCommands: any = undefined;
    public editFileCommands: any = undefined;
    public evalController: any = undefined;
    public gotoCommands: any = undefined;
    public helpCommands: any = undefined;
    public keyHandler: any = undefined; // TODO same as k
    public k: any = undefined; // TODO same as keyHandler
    public keyHandlerCommands: any = undefined;
    public killBufferCommands: any = undefined;
    public leoCommands: any = undefined;
    public macroCommands: any = undefined;
    public miniBufferWidget: any = undefined;
    public printingController: any = undefined;
    public queryReplaceCommands: any = undefined;
    public rectangleCommands: any = undefined;
    public searchCommands: any = undefined;
    public spellCommands: any = undefined;
    public leoTestManager: any = undefined;
    public vimCommands: any = undefined;

    //@+node:felix.20210223220814.10: *4* c.initSettings
    //Init the settings *before* initing the objects.
    // c = self
    // from leo.core import leoConfig
    public config: any = {}; // TODO
    // c.config = leoConfig.LocalConfigManager(c, previousSettings)
    // g.app.config.setIvarsFromSettings(c)

    //@+node:felix.20210223002937.1: *3* constructor & helpers
    constructor(
        fileName: string,
        gui?: LeoUI,
        previousSettings?: any,
        relativeFileName?: any
    ) {
        const c: Commands = this;

        // From Official Ivars
        this.gui = gui || g.app.gui!;

        // From initFileIvars
        this.mFileName = fileName || '';
        this.mRelativeFileName = relativeFileName || '';

        // From initObjects
        const gnx: string = 'hidden-root-vnode-gnx';
        this.fileCommands = new FileCommands(this); // c.fileCommands = DummyFileCommands()
        this.hiddenRootNode = new VNode(this, 'hidden-root-vnode-gnx');
        this.hiddenRootNode.h = '<hidden root vnode>';
        this.fileCommands.gnxDict = {}; // RESET gnxDict
        this.chapterController = {}; // TODO self.chapterController = leoChapters.ChapterController(c)
        this.nodeHistory = new NodeHistory(c);

        // From initConfigSettings 
        this.collapse_on_lt_arrow = true; // getBool('collapse-on-lt-arrow', default=True)

        // From finishCreate
        c.createCommandNames();

    }

    //@+node:felix.20210223220814.9: *4* c.initObjects
    // * initObjects done in constructor.
    // * Kept here as comments for reference

    // c = self
    // gnx = 'hidden-root-vnode-gnx'
    // assert not hasattr(c, 'fileCommands'), c.fileCommands

    // class DummyFileCommands:
    // def __init__(self):
    // self.gnxDict = {}

    // c.fileCommands = DummyFileCommands()
    // self.hiddenRootNode = leoNodes.VNode(context=c, gnx=gnx)
    // self.hiddenRootNode.h = '<hidden root vnode>'
    // c.fileCommands = None
    // # Create the gui frame.
    // title = c.computeWindowTitle(c.mFileName)
    // if not g.app.initing:
    // g.doHook("before-create-leo-frame", c=c)
    // self.frame = gui.createLeoFrame(c, title)
    // assert self.frame
    // assert self.frame.c == c
    // from leo.core import leoHistory
    // self.nodeHistory = leoHistory.NodeHistory(c)

    // self.initConfigSettings()
    // c.setWindowPosition() # Do this after initing settings.
    // # Break circular import dependencies by doing imports here.
    // # These imports take almost 3/4 sec in the leoBridge.
    // from leo.core import leoAtFile
    // from leo.core import leoBeautify  # So decorators are executed.
    // assert leoBeautify  # for pyflakes.
    // from leo.core import leoChapters
    // # from leo.core import leoTest2  # So decorators are executed.
    // # assert leoTest2  # For pyflakes.
    // # User commands...
    // from leo.commands import abbrevCommands
    // from leo.commands import bufferCommands
    // from leo.commands import checkerCommands
    // assert checkerCommands
    // # To suppress a pyflakes warning.
    // # The import *is* required to define commands.
    // from leo.commands import controlCommands
    // from leo.commands import convertCommands
    // from leo.commands import debugCommands
    // from leo.commands import editCommands
    // from leo.commands import editFileCommands
    // from leo.commands import gotoCommands
    // from leo.commands import helpCommands
    // from leo.commands import keyCommands
    // from leo.commands import killBufferCommands
    // from leo.commands import rectangleCommands
    // from leo.commands import spellCommands
    // # Import files to execute @g.commander_command decorators
    // from leo.core import leoCompare
    // assert leoCompare
    // from leo.core import leoDebugger
    // assert leoDebugger
    // from leo.commands import commanderEditCommands
    // assert commanderEditCommands
    // from leo.commands import commanderFileCommands
    // assert commanderFileCommands
    // from leo.commands import commanderFindCommands
    // assert commanderFindCommands
    // from leo.commands import commanderHelpCommands
    // assert commanderHelpCommands
    // from leo.commands import commanderOutlineCommands
    // assert commanderOutlineCommands
    // # Other subcommanders.
    // from leo.core import leoFind # Leo 4.11.1
    // from leo.core import leoKeys
    // from leo.core import leoFileCommands
    // from leo.core import leoImport
    // from leo.core import leoMarkup
    // from leo.core import leoPersistence
    // from leo.core import leoPrinting
    // from leo.core import leoRst
    // from leo.core import leoShadow
    // from leo.core import leoTangle
    // from leo.core import leoTest
    // from leo.core import leoUndo
    // from leo.core import leoVim
    // # Define the subcommanders.
    // self.keyHandler = self.k    = leoKeys.KeyHandlerClass(c)
    // self.chapterController      = leoChapters.ChapterController(c)
    // self.shadowController       = leoShadow.ShadowController(c)
    // self.fileCommands           = leoFileCommands.FileCommands(c)
    // self.findCommands           = leoFind.LeoFind(c)
    // self.atFileCommands         = leoAtFile.AtFile(c)
    // self.importCommands         = leoImport.LeoImportCommands(c)
    // self.markupCommands         = leoMarkup.MarkupCommands(c)
    // self.persistenceController  = leoPersistence.PersistenceDataController(c)
    // self.printingController     = leoPrinting.PrintingController(c)
    // self.rstCommands            = leoRst.RstCommands(c)
    // self.tangleCommands         = leoTangle.TangleCommands(c)
    // self.testManager            = leoTest.TestManager(c)
    // self.vimCommands            = leoVim.VimCommands(c)
    // # User commands
    // self.abbrevCommands     = abbrevCommands.AbbrevCommandsClass(c)
    // self.bufferCommands     = bufferCommands.BufferCommandsClass(c)
    // self.controlCommands    = controlCommands.ControlCommandsClass(c)
    // self.convertCommands    = convertCommands.ConvertCommandsClass(c)
    // self.debugCommands      = debugCommands.DebugCommandsClass(c)
    // self.editCommands       = editCommands.EditCommandsClass(c)
    // self.editFileCommands   = editFileCommands.EditFileCommandsClass(c)
    // self.gotoCommands       = gotoCommands.GoToCommands(c)
    // self.helpCommands       = helpCommands.HelpCommandsClass(c)
    // self.keyHandlerCommands = keyCommands.KeyHandlerCommandsClass(c)
    // self.killBufferCommands = killBufferCommands.KillBufferCommandsClass(c)
    // self.rectangleCommands  = rectangleCommands.RectangleCommandsClass(c)
    // self.spellCommands      = spellCommands.SpellCommandsClass(c)
    // self.undoer             = leoUndo.Undoer(c)
    // # Create the list of subcommanders.
    // self.subCommanders = [
    // self.abbrevCommands,
    // self.atFileCommands,
    // self.bufferCommands,
    // self.chapterController,
    // self.controlCommands,
    // self.convertCommands,
    // self.debugCommands,
    // self.editCommands,
    // self.editFileCommands,
    // self.fileCommands,
    // self.findCommands,
    // self.gotoCommands,
    // self.helpCommands,
    // self.importCommands,
    // self.keyHandler,
    // self.keyHandlerCommands,
    // self.killBufferCommands,
    // self.persistenceController,
    // self.printingController,
    // self.rectangleCommands,
    // self.rstCommands,
    // self.shadowController,
    // self.spellCommands,
    // self.tangleCommands,
    // self.testManager,
    // self.vimCommands,
    // self.undoer,
    // ]
    // # Other objects
    // c.configurables = c.subCommanders[:]
    // # A list of other classes that have a reloadSettings method
    // c.db = g.app.commander_cacher.get_wrapper(c)
    // from leo.plugins import free_layout
    // self.free_layout = free_layout.FreeLayoutController(c)
    // if hasattr(g.app.gui, 'styleSheetManagerClass'):
    // self.styleSheetManager = g.app.gui.styleSheetManagerClass(c)
    // self.subCommanders.append(self.styleSheetManager)
    // else:
    // self.styleSheetManager = None

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

    //@+node:felix.20210112001859.1: *3* c.Drawing & coloring
    public recolor(): void {
        console.log("recolor");
    }

    public redraw(): void {
        console.log("redraw");
    }

    public redraw_after_icons_changed(): void {
        console.log("redraw_after_icons_changed");
    }

    public alert(...arg: any[]): void {
        console.log(...arg);
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

    //@+node:felix.20210131011508.3: *5* c.all_positions
    /**
     * A generator return all positions of the outline, in outline order.
     */
    public *all_positions(copy = true): Generator<Position> {
        const c: Commands = this;
        const p: Position | undefined = c.rootPosition();
        while (p && p.__bool__()) {
            yield (copy ? p.copy() : p);
            p.moveToThreadNext();
        }
    }

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
    public *all_positions_for_v(v: VNode, stack?: StackEntry[]): Generator<Position> {

        const c: Commands = this;

        if (!stack) {
            stack = [];
        }

        if (!(v instanceof VNode)) {
            g.es_print(`not a VNode: ${JSON.stringify(v)}`);
            return;  // Stop the generator.
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
     * The generator yields all **root** anywhere in the outline that satisfy
     * the predicate. Once a root is found, the generator skips its subtree.
     */
    public *all_roots(copy = true, predicate?: (p: Position) => boolean): Generator<Position> {
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
                yield p.copy();  // 2017/02/19
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
                yield (copy ? p.copy() : p);
                p.moveToThreadNext();
            }
        }
    }

    //@+node:felix.20210131011508.7: *5* c.all_unique_roots
    /**
     * A generator yielding all unique root positions in the outline that
     * satisfy the given predicate. p.isAnyAtFileNode is the default
     * predicate.
     *
     * The generator yields all **root** anywhere in the outline that satisfy
     * the predicate. Once a root is found, the generator skips its subtree.
     */
    public *all_unique_roots(copy = true, predicate?: (p: Position) => boolean): Generator<Position> {
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
                yield (copy ? p.copy() : p);
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
    public *safe_all_positions(copy = true): Generator<Position> {
        const c: Commands = this;
        const p: Position | undefined = c.rootPosition(); // Make one copy.
        while (p && p.__bool__()) {
            yield (copy ? p.copy() : p);
            p.safeMoveToThreadNext();
        }
    }

    //@+node:felix.20210228004000.1: *5* c.all_Root_Children
    /**
     * Return all root children P nodes
     */
    public *all_Root_Children(copy = true): Generator<Position> {
        const c: Commands = this;
        const p: Position | undefined = c.rootPosition(); // Make one copy.
        while (p && p.__bool__()) {
            yield (copy ? p.copy() : p);
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
            // *Always* return a copy.
            return c._currentPosition.copy();
        }
        return c.rootPosition();
    }

    // For compatibility with old scripts...
    // currentVnode = currentPosition

    //@+node:felix.20210131011420.3: *5* c.fileName & relativeFileName & shortFileName
    // Compatibility with scripts

    public fileName(): string {
        let s: string = this.mFileName || "";
        if (g.isWindows) {
            s = s.replace('\\', '/');
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
            let back: Position = p.visBack(c);
            if (back.__bool__() && back.isVisible(c)) {
                p = back;
            } else {
                break;
            }
        }
        return p;
    }

    //@+node:felix.20210131011420.5: *5* c.getTabWidth
    /**
     * Return the tab width in effect at p.
     */
    public getTabWidth(p: Position): number {
        const c: Commands = this;
        // const val:number = g.scanAllAtTabWidthDirectives(c, p);
        // TODO: NEEDED?
        const val: number = 10;
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
        return !!c._currentPosition &&
            !!root &&
            c._currentPosition.__bool__() &&
            root.__bool__() && c._currentPosition.__eq__(root);
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
        return current && current.__bool__() && current.hasNext()!;
        return false;
    }

    //@+node:felix.20210131011420.9: *6* c.isCurrentPosition
    public isCurrentPosition(p: Position): boolean {
        const c: Commands = this;
        if (!p || !c._currentPosition ||
            !p.__bool__() || !!c._currentPosition.__bool__()) {
            return false;
        }
        return p.__eq__(c._currentPosition);
    }

    //@+node:felix.20210131011420.10: *6* c.isRootPosition
    public isRootPosition(p: Position): boolean {
        const c: Commands = this;
        const root: Position | undefined = c.rootPosition();
        return !!p &&
            !!root &&
            p.__bool__() &&
            root.__bool__() && p.__eq__(root);
    }

    //@+node:felix.20210131011420.11: *5* c.isChanged
    public isChanged(): boolean {
        return this.changed;
    }

    //@+node:felix.20210131011420.12: *5* c.lastTopLevel
    /**
     * Return the last top-level position in the outline.
     */
    public lastTopLevel(): Position {
        const c: Commands = this;
        const p: Position | undefined = c.rootPosition();
        while (p && p.hasNext()) {
            p.moveToNext();
        }
        return p!;
    }

    //@+node:felix.20210215204131.1: *5* c.lastVisible
    /**
      *Move to the last visible node of the present chapter or hoist.
     */
    public lastVisible(): Position {
        const c: Commands = this;
        let p: Position = c.p;
        while (1) {
            const next: Position = p.visNext(c);
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
    public positionExists(p: Position, root?: Position, trace?: boolean): boolean {

        if (!p || !p.__bool__() || !p.v) {
            return false;
        }

        const rstack: StackEntry[] = (root && root.__bool__()) ? root.stack.concat([[root.v, root._childIndex]]) : [];
        const pstack: StackEntry[] = p.stack.concat([[p.v, p._childIndex]]);

        if (rstack.length > pstack.length) {
            return false;
        }

        let par: VNode = this.hiddenRootNode!;

        let arrayLength: number = pstack.length;

        for (let j = 0; j < arrayLength; j++) {
            const x: StackEntry = pstack[j];

            if (j < rstack.length && (x[0].gnx !== rstack[j][0].gnx || x[1] !== rstack[j][1])) {
                return false;
            }

            let v: VNode;
            let i: number;
            [v, i] = x;

            if (i >= par.children.length || v.gnx !== par.children[i].gnx) {
                return false;
            }

            par = v;
        }
        return true;
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
        v.expandedPositions = v.expandedPositions.filter(z => c.positionExists(z));

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
    public visLimit(): [Position, boolean] | undefined {
        const c: Commands = this;
        const cc: any = false;// c.chapterController
        if (c.hoistStack.length) {
            const bunch: HoistStackEntry = c.hoistStack[c.hoistStack.length - 1];
            const p: Position = bunch.p;
            const limitIsVisible: boolean = !cc || !p.h.startsWith('@chapter');
            return [p, limitIsVisible];
        }
        return undefined;
    }

    //@+node:felix.20210215204308.1: *5* c.vnode2allPositions
    /**
     * Given a VNode v, find all valid positions p such that p.v = v.
     * Not really all, just all for each of v's distinct immediate parents.
     */
    public vnode2allPositions(v: VNode): Position[] {
        const c: Commands = this;
        const context: Commands = v.context;  // v's commander.
        // console.assert(c.fileName === context.fileName);
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
        const context: Commands = v.context;  // v's commander.
        // console.assert(c.fileName === context.fileName);
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
        g.doHook("clear-mark", c, p);
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
            // * Leo used to send it to gui
            // const w:any = c.frame.body.wrapper;
            // w.setAllText(s);
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
            c.redraw_after_icons_changed();
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
        if (!(p && p.__bool__())) {
            g.trace('===== no p', g.callers());
            return;
        }
        if (c.positionExists(p)) {
            if (c._currentPosition && p.__eq__(c._currentPosition)) {
                // We have already made a copy.
                // pass;
            } else { // Make a copy _now_
                c._currentPosition = p.copy();
            }
        } else { // 2011/02/25:
            c._currentPosition = c.rootPosition();
            g.trace(`Invalid position: ${p.h}`);
            g.trace(g.callers());
            // Don't kill unit tests for this kind of problem.
        }
    }

    // * For compatibility with old scripts.
    //setCurrentVnode = setCurrentPosition

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

        // TODO: needed?
        // c.frame.tree.setHeadline(p, s);
    }

    //@+node:felix.20210215204844.1: *5* c.setMarked (calls hook)
    public setMarked(p: Position): void {
        const c: Commands = this;
        p.setMarked();
        p.setDirty();  // Defensive programming.
        g.doHook("set-mark", c, p);
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
        }
        else {
            c._topPosition = undefined;
        }
    }

    // Define these for compatibility with old scripts...

    // topVnode = topPosition
    // setTopVnode = setTopPosition

    //@+node:felix.20211005023225.1: *3* c.Gui
    //@+node:felix.20211022202201.1: *4* c.drawing
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

    //@+node:felix.20211005023800.1: *4* c.Expand/contract
    //@+node:felix.20211005023821.1: *5* c.contractAllHeadlines
    /**
     * Contract all nodes in the outline.
     */
    public contractAllHeadlines(redrawFlag: boolean = true): void {
        const c: Commands = this;
        for (let p of c.all_positions()) {
            p.contract();
        }
        // Select the topmost ancestor of the presently selected node.
        const p = c.p;
        while (p.__bool__() && p.hasParent()) {
            p.moveToParent();
        }
        if (redrawFlag) {
            c.selectPosition(p);
        }
        c.expansionLevel = 1;  // Reset expansion level.
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
        while (p.__bool__() && !p.__eq__(last)) {
            p.expand();
            p = p.threadNext();
        }
    }

    //@+node:felix.20211005024009.1: *5* c.expandToLevel
    public expandToLevel(level: number): void {
        const c: Commands = this;
        const n: number = c.p.level();
        // let old_expansion_level = c.expansionLevel;
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

        /*
        if c.expansionLevel != old_expansion_level:
            c.redraw()
        // It's always useful to announce the level.
        // c.k.setLabelBlue('level: %s' % (max_level+1))
        // g.es('level', max_level + 1)
        c.frame.putStatusLine(f"level: {max_level + 1}")
            // bg='red', fg='red'
        */

    }

    //@+node:felix.20211023195447.1: *4* c.Menus
    //@+node:felix.20211023195447.3: *5* c.Menu Enablers
    //@+node:felix.20211023195447.4: *6* c.canClone
    public canClone(): boolean {
        const c: Commands = this;
        if (c.hoistStack.length) {
            const current: Position = c.p;
            const bunch = c.hoistStack[-1]
            return current !== bunch.p;
        }
        return true;
    }
    //@+node:felix.20211023195447.5: *6* c.canContractAllHeadlines
    /**
     * Contract all nodes in the tree.
     */
    public canContractAllHeadlines(): boolean {
        const c: Commands = this;
        for (let p of c.all_positions()) {  // was c.all_unique_positions()
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
            if (p !== current && p.isExpanded()) {
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
        for (let p of c.all_positions()) {  // was c.all_unique_positions()
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
            if (p != current && !p.isExpanded()) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20211023195447.14: *6* c.canExtract, canExtractSection & canExtractSectionNames
    public canExtract(): boolean {
        const c: Commands = this;
        const w = c.frame.body.wrapper; // TODO 
        return w && w.hasSelection();
    }
    public canExtractSection(): boolean {
        const c: Commands = this;
        const w = c.frame.body.wrapper; // TODO 
        if (!w) {
            return false;
        }
        const s: string = w.getSelectedText();
        if (!s) {
            return false;
        }
        const line: string = g.get_line(s, 0);
        const i1 = line.indexOf("<<");
        const j1 = line.indexOf(">>");
        const i2 = line.indexOf("@<");
        const j2 = line.indexOf("@>");
        return ((-1 < i1) && (i1 < j1)) || ((-1 < i2) && (i2 < j2));
    }
    //@+node:felix.20211023195447.15: *6* c.canFindMatchingBracket
    //@@nobeautify

    public canFindMatchingBracket(): boolean {
        const c: Commands = this;
        const brackets: string = "()[]{}"
        const w = c.frame.body.wrapper; // TODO 
        const s = w.getAllText();
        const ins: number = w.getInsertPoint();

        const c1 = ins < s.length ? s[ins] : '';

        const c2 = ((0 <= ins - 1) && (ins - 1 < s.length)) ? s[ins - 1] : '';

        const val = (c1 && brackets.includes(c1)) || (c2 && brackets.includes(c2));
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

        // c = self
        // if c.hoistStack.length:
        // p = c.hoistStack[-1].p
        // return p and not c.isCurrentPosition(p)
        // elif c.currentPositionIsRootPosition():
        // return c.currentPositionHasNext()
        // else:
        // return true
    }

    //@+node:felix.20211023195447.17: *6* c.canMoveOutlineDown
    public canMoveOutlineDown(): boolean {
        const c: Commands = this;
        const p: Position = this.p;
        return p && p.__bool__() && p.visNext(c).__bool__();
    }
    //@+node:felix.20211023195447.18: *6* c.canMoveOutlineLeft
    public canMoveOutlineLeft(): boolean {
        const c: Commands = this;
        const p: Position = this.p;
        if (c.hoistStack.length) {
            const bunch = c.hoistStack[-1];
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
            const bunch = c.hoistStack[-1];
            return p && p.hasBack() && p !== bunch.p
        }
        return p && p.__bool__() && p.hasBack();
    }
    //@+node:felix.20211023195447.20: *6* c.canMoveOutlineUp
    public canMoveOutlineUp(): boolean {
        const c: Commands = this;
        const current: Position = this.p;
        const visBack: Position | false = (current && current.__bool__()) && current.visBack(c);
        if (!visBack || !visBack.__bool__()) {
            return false;
        }
        if (visBack.visBack(c).__bool__()) {
            return true;
        }
        if (c.hoistStack.length) {
            let w_vis: [Position, boolean] | undefined = c.visLimit();
            let limitIsVisible: boolean;
            let limit: Position | undefined;
            if (w_vis) {
                limit = w_vis[0];
                limitIsVisible = w_vis[1];
            } else {
                limitIsVisible = false;
            }
            if (limitIsVisible && limit) {  // A hoist
                return !current.__eq__(limit);
            }
            // A chapter.
            return !!limit && !current.__eq__(limit.firstChild());

        }
        return (!!c.rootPosition() && c.rootPosition()!.__bool__()) && !current.__eq__(c.rootPosition()!);
    }
    //@+node:felix.20211023195447.21: *6* c.canPasteOutline
    public canPasteOutline(s?: string): boolean {
        if (!s) {
            s = g.app.gui!.getTextFromClipboard(); // ! HAS TO BE IMPLEMENTED IN GUI
        }
        if (s && g.match(s, 0, g.app.prolog_prefix_string)) {
            return true;
        }
        return false;
    }
    //@+node:felix.20211023195447.22: *6* c.canPromote
    public canPromote(): boolean {
        const p: Position = this.p;
        return p && p.__bool__() && p.hasChildren()
    }
    //@+node:felix.20211023195447.23: *6* c.canSelect....
    public canSelectThreadBack(): boolean {
        const p: Position = this.p;
        return p.hasThreadBack()
    }
    public canSelectThreadNext(): boolean {
        const p: Position = this.p;
        return p.hasThreadNext()
    }
    public canSelectVisBack(): boolean {
        const c: Commands = this;
        const p: Position = this.p;
        return p.visBack(c).__bool__();
    }
    public canSelectVisNext(): boolean {
        const c: Commands = this;
        const p: Position = this.p;
        return p.visNext(c).__bool__();
    }
    //@+node:felix.20211023195447.24: *6* c.canShiftBodyLeft/Right
    public canShiftBodyLeft(): boolean {
        const c: Commands = this;
        const w = c.frame.body.wrapper;
        return w && w.getAllText();
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
        return c.undoer.canUndo()
    }
    public canRedo(): boolean {
        const c: Commands = this;
        return c.undoer.canRedo()
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
    //@+node:felix.20211005023456.1: *5* c.selectPosition
    /**
     * Select a new position, redrawing the screen *only* if we must
     * change chapters.
     */
    public selectPosition(p: Position): void {

        const trace = true; // For # 2167.
        const c: Commands = this;
        // const cc = c.chapterController;

        if (!p || !p.__bool__()) {
            if (!g.app.batchMode) { // A serious error.
                g.trace('Warning: no p', g.callers());
            }
        }

        // if(cc && !cc.selectChapterLockout){
        //     cc.selectChapterForPosition(p)
        //     // Calls c.redraw only if the chapter changes.
        // }

        // De-hoist as necessary to make p visible.
        if (c.hoistStack) {
            while (c.hoistStack.length) {
                let bunch = c.hoistStack[c.hoistStack.length - 1];
                if (c.positionExists(p, bunch.p)) {
                    break;
                } else {
                    if (trace) {
                        console.log('trace in selectPosition');

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

        c.setCurrentPosition(p);

        // Compatibility, but confusing.
        // TODO : Is this needed? (not used in Leos codebase)
        // selectVnode = selectPosition

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
        }
    }

    //@-others

}

//@-others
//@@language typescript
//@@tabwidth -4

export interface Commands extends CommanderOutlineCommands, CommanderFileCommands {
    canCutOutline: () => boolean;
    canShiftBodyRight: () => boolean;
    canExtractSectionNames: () => boolean;
}

// Apply the mixins into the base class via
// the JS at runtime & aliases for VNode members

applyMixins(Commands, [CommanderOutlineCommands, CommanderFileCommands]);
Commands.prototype.canCutOutline = Commands.prototype.canDeleteHeadline;
Commands.prototype.canShiftBodyRight = Commands.prototype.canShiftBodyLeft;
Commands.prototype.canExtractSectionNames = Commands.prototype.canExtract;


//@-leo
