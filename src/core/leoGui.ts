//@+leo-ver=5-thin
//@+node:felix.20221119204422.1: * @file src/core/leoGui.ts
/**
 * A module containing the base gui-related classes.
 *
 * These classes hide the details of which gui is actually being used.
 * Leo's core calls this class to allocate all gui objects.
 *
 * Plugins may define their own gui classes by setting g.app.gui.
 */
//@+<< leoGui imports >>
//@+node:felix.20221120015443.1: ** << leoGui imports >>
import * as g from './leoGlobals';
import { StringFindTabManager } from './findTabManager';
import { Position } from './leoNodes';
import { Commands } from './leoCommands';
import { LeoFrame, StringTextWrapper } from './leoFrame';
//@-<< leoGui imports >>
//@+others
//@+node:felix.20221119205229.1: ** class LeoGui
/**
 * The base class of all gui classes.
 *
 * Subclasses are expected to override all do-nothing methods of public class.
 */
export class LeoGui {
    public active: boolean; //  Used only by qt_gui.
    public consoleOnly: boolean; //  True if g.es goes to console.
    public globalFindTabManager: StringFindTabManager | undefined;
    public globalFindTab: any;
    public idleTimeClass: any; // IdleTime | undefined | g.NullObject;  //  Hard to annotate.
    public isNullGui: boolean;
    public lastFrame: any;
    public leoIcon: any;
    public mGuiName: string;
    public mainLoop: any;
    public plainTextWidget: any; //  For SpellTabHandler class only.
    public root: Position | undefined;
    public script: string | undefined;
    public scriptFileName: string | undefined;

    // * For LeoJS
    // the index of current document frame in g.app.windowList, mostly to get c, and the title, openDirectory, etc.
    public frameIndex: number = 0;

    public splashScreen: any;
    public utils: any;

    // public ScriptingControllerClass: any; // ? UNEEDED IN LEOJS ?
    //
    //  Define special keys that may be overridden is subclasses.
    public ignoreChars: string[]; //  Keys that should always be ignored.
    public FKeys: string[]; //  The representation of F-keys.
    public specialChars: string[]; //  A list of characters/keys to be handle specially.

    //@+others
    //@+node:felix.20221120001229.2: *3* LeoGui.__init__
    /**
     * Ctor for the LeoGui class.
     */
    constructor(guiName = 'nullGui') {
        this.active = false; //  Used only by qt_gui.
        this.consoleOnly = true; //  True if g.es goes to console.
        this.globalFindTabManager = undefined;
        this.globalFindTab = undefined;
        this.idleTimeClass = undefined; //  Hard to annotate.
        this.isNullGui = false;
        this.lastFrame = undefined;
        this.leoIcon = undefined;
        this.mGuiName = guiName;
        this.mainLoop = undefined;
        this.plainTextWidget = undefined; //  For SpellTabHandler class only.
        this.root = undefined;
        this.script = undefined;
        this.scriptFileName = undefined;

        this.splashScreen = undefined;
        this.utils = undefined;

        // this.ScriptingControllerClass = NullScriptingControllerClass; // ? UNEEDED IN LEOJS ?
        //
        //  Define special keys that may be overridden is subclasses.
        this.ignoreChars = []; //  Keys that should always be ignored.
        this.FKeys = []; //  The representation of F-keys.
        this.specialChars = []; //  A list of characters/keys to be handle specially.
    }
    //@+node:felix.20221120001229.3: *3* LeoGui: Must be defined only in base class
    //@+node:felix.20221120001229.4: *4* LeoGui.create_key_event (LeoGui)
    // def create_key_event(
    //     self,
    //     c: Cmdr,
    //     binding: str=None,
    //     char: str=None,
    //     event: Event=None,
    //     w: Wrapper=None,
    //     x: int=None,
    //     x_root: int=None,
    //     y: int=None,
    //     y_root: int=None,
    // ) -> Event:
    //     # Do not call strokeFromSetting here!
    //     # For example, this would wrongly convert Ctrl-C to Ctrl-c,
    //     # in effect, converting a user binding from Ctrl-Shift-C to Ctrl-C.
    //     return LeoKeyEvent(c, char, event, binding, w, x, y, x_root, y_root)
    //@+node:felix.20221120001229.5: *4* LeoGui.guiName
    public guiName(): string {
        try {
            return this.mGuiName;
        } catch (e) {
            return 'invalid gui name';
        }
    }
    //@+node:felix.20221120001229.6: *4* LeoGui.setScript
    public setScript(script?: string, scriptFileName?: string): void {
        this.script = script;
        this.scriptFileName = scriptFileName;
    }
    //@+node:felix.20221120001229.7: *4* LeoGui.event_generate (LeoGui)
    // public event_generate(self, c: Cmdr, char: str, shortcut: str, w: Wrapper) -> None:
    //     event = self.create_key_event(c, binding=shortcut, char=char, w=w)
    //     c.k.masterKeyHandler(event)
    //     c.outerUpdate()
    //@+node:felix.20221120001229.8: *3* LeoGui: Must be defined in subclasses
    //@+node:felix.20221120001229.9: *4* LeoGui.destroySelf
    public destroySelf(): void {
        this.oops();
    }
    //@+node:felix.20221120001229.10: *4* LeoGui.dialogs
    /**
     * Run Leo's interactive search dialog.
     */
    public interactiveSearch(
        p_backward: boolean,
        p_regex: boolean,
        p_word: boolean
    ): any {
        this.oops();
    }
    /**
     * Run Leo's find method.
     */
    public find(p_fromOutline: boolean, p_reverse: boolean): any {
        this.oops();
    }
    /**
     * Run Leo's replace method.
     */
    public replace(p_fromOutline?: boolean, p_thenFind?: boolean): any {
        this.oops();
    }
    /**
     * Run Leo's findDef and findSymbol methods.
     */
    public findSymbol(p_def: boolean): any {
        this.oops();
    }
    /**
     * Sets a specific Find panel setting.
     */
    public setSearchSetting(p_id: string) {
        this.oops();
    }
    /**
     * Asks for node headline string and inserts node.
     */
    public editHeadline(
        p_node?: Position,
        p_fromOutline?: boolean,
        p_prompt?: string
    ): any {
        this.oops();
    }
    /**
     * Asks for node headline string and inserts node.
     */
    public insertNode(
        p_node: Position | undefined,
        p_fromOutline: boolean,
        p_interrupt: boolean,
        p_asChild: boolean
    ): any {
        this.oops();
    }
    /**
    /**
     * Create and run Leo's About Leo dialog.
     */
    public runAboutLeoDialog(
        c: Commands,
        version: string,
        theCopyright: string,
        url: string,
        email: string
    ): any {
        this.oops();
    }
    /**
     * Create and run a dialog to get g.app.LeoID.
     */
    public runAskLeoIDDialog(): any {
        this.oops();
    }

    /**
     * Create and run an askOK dialog .
     */
    public runAskOkDialog(
        c: Commands,
        title: string,
        message: string,
        text = 'Ok'
    ): any {
        this.oops();
    }

    /**
     * Create and run askOkCancelNumber dialog .
     */
    public runAskOkCancelNumberDialog(
        c: Commands,
        title: string,
        message: string,
        cancelButtonText?: string,
        okButtonText?: string
    ): any {
        this.oops();
    }

    /**
     * Create and run askOkCancelString dialog ."
     */
    public runAskOkCancelStringDialog(
        c: Commands,
        title: string,
        message: string,
        cancelButtonText: string,
        okButtonText: string,
        defaultParam = '',
        wide = false
    ): any {
        this.oops();
    }

    /**
     * Create and run an askYesNo dialog.
     */
    public runAskYesNoDialog(
        c: Commands,
        title: string,
        message: string,
        yes_all = false,
        no_all = false
    ): any {
        this.oops();
    }

    /**
     * Create and run an askYesNoCancel dialog .
     */
    public runAskYesNoCancelDialog(
        c: Commands,
        title: string,
        message: string,
        yesMessage = 'Yes',
        noMessage = 'No',
        yesToAllMessage = '',
        defaultButton = 'Yes',
        cancelMessage = ''
    ): any {
        this.oops();
    }

    /**
     * Display a modal TkPropertiesDialog
     */
    public runPropertiesDialog(
        title = 'Properties',
        data: string,
        callback: () => void,
        buttons: string[] = []
    ): any {
        this.oops();
    }
    //@+node:felix.20221120001229.11: *4* LeoGui.file dialogs
    /**
     * Create and run an open file dialog .
     */
    public runOpenFileDialog(
        c: Commands,
        title: string,
        filetypes: [string, string][],
        defaultExtension: string,
        multiple?: boolean,
        startpath?: string
    ): Thenable<string[] | string> {
        // Return type depends on the evil multiple keyword.
        this.oops();
        return Promise.resolve(['no']);
    }

    /**
     * Create and run a save file dialog .
     */
    public runSaveFileDialog(
        c: Commands,
        title: string,
        filetypes: [string, string][],
        defaultExtension: string
    ): Thenable<string> {
        this.oops();
        return Promise.resolve('no');
    }

    public showRecentLeoFiles(): any {
        this.oops();
        return Promise.resolve();
    }
    //@+node:felix.20221120210715.1: *4* LeoGui.addLogPaneEntry (LeoJs)
    public addLogPaneEntry(...args: any[]): void {
        this.oops();
        // Adds a message string to LeoJS log pane. See LeoUi.ts
    }
    //@+node:felix.20230902142624.1: *4* LeoGui.focusLogPane (LeoJs)
    public showLogPane(p_focus?: boolean): void {
        // Shows and optionally puts focus on the log pane
    }
    //@+node:felix.20221120210000.1: *4* LeoGui.finishStartup (LeoJs)
    public finishStartup(): void {
        // * LeoJS GUI needs this method to finish it's startup
        // Set all remaining local objects, set ready flag(s) and refresh all panels
        // pass
    }
    //@+node:felix.20221120212654.1: *4* LeoGui.get1Arg (LeoJs)
    public get1Arg(
        options?: any,
        token?: any,
        tabList?: string[]
    ): Thenable<string | undefined> {
        return Promise.resolve('');
    }
    //@+node:felix.20231231202753.1: *4* leoGui.getWorkspaceSession
    /**
     * Checks if Session per workspace is true, if so returns file list
     * Undefined otherwise
     */
    public getWorkspaceSession(): string[] | undefined {
        return undefined;
    }

    //@+node:felix.20231231202816.1: *4* leoGui.setWorkspaceSession
    /**
     * Sets session files list for this workspace
     */
    public setWorkspaceSession(p_files: string[]): Thenable<void> {
        return Promise.resolve();
    }

    //@+node:felix.20221120205239.1: *4* LeoGui.makeAllBindings (LeoJs)
    public makeAllBindings(): void {
        // Make all command/key bindings : see LeoJS commadBindings
    }
    //@+node:felix.20221120001229.12: *4* LeoGui.panels

    /**
     * Create Compare panel.
     */
    public createComparePanel(c: Commands): void {
        this.oops();
    }
    /**
     * Create a find tab in the indicated frame.
     */
    public createFindTab(c: Commands, parentFrame: any): void {
        this.oops();
    }
    /**
     * Create a hidden Font panel.
     */
    public createFontPanel(c: Commands): void {
        this.oops();
    }
    /**
     * Create a new Leo frame.
     */
    public createLeoFrame(c: Commands, title: string): any {
        this.oops();
    }
    /**
     * Focus in Find Panel
     */
    public startSearch(): void {
        this.oops();
    }
    //@+node:felix.20221120001229.13: *4* LeoGui.runMainLoop
    public runMainLoop(): void {
        this.oops();
    }
    //@+node:felix.20221120001229.14: *4* LeoGui.utils
    //@+at Subclasses are expected to subclass all of the following methods.
    // These are all do-nothing methods: callers are expected to check for
    // None returns.
    // The type of commander passed to methods depends on the type of frame
    // or dialog being created. The commander may be a Commands instance or
    // one of its subcommanders.
    //@+node:felix.20221120001229.15: *5* LeoGui.Clipboard
    public replaceClipboardWith(s: string): void {
        this.oops();
    }
    public getTextFromClipboard(): string {
        this.oops();
        return '';
    }
    //@+node:felix.20221120001229.16: *5* LeoGui.Dialog utils
    public loadSearchSettings(): void {
        this.oops();
    }

    /**
     * Attach the Leo icon to a window.
     */
    public attachLeoIcon(window: any): void {
        this.oops();
    }

    /**
     * Center a dialog.
     */
    public center_dialog(dialog: string): void {
        this.oops();
    }

    /**
     * Create a labeled frame.
     */
    public create_labeled_frame(
        parent: string,
        caption = '',
        relief = 'groove',
        bd = 2,
        padx = 0,
        pady = 0
    ): void {
        this.oops();
    }
    //@+node:felix.20221120001229.17: *5* LeoGui.Font
    public getFontFromParams(
        family: string,
        size: string,
        slant: string,
        weight: string,
        defaultSize = 12
    ): any {
        this.oops();
    }
    //@+node:felix.20221120001229.18: *5* LeoGui.getFullVersion
    public getFullVersion(c?: Commands): string {
        return 'LeoGui: dummy version';
    }

    //@+node:felix.20221120001229.19: *5* LeoGui.makeScriptButton
    public makeScriptButton(
        c: Commands,
        args?: string,
        p?: Position,
        script?: string,
        buttonText?: string,
        balloonText = 'Script Button',
        shortcut?: string,
        bg = 'LightSteelBlue1',
        define_g = true,
        define_name = '__main__',
        silent = false
    ): void {
        this.oops();
    }
    //@+node:felix.20221120001229.20: *3* LeoGui: May be defined in subclasses
    //@+node:felix.20221120001229.21: *4* LeoGui.dismiss_spash_screen
    public dismiss_splash_screen(): void {
        // May be overridden in subclasses.
        // pass
    }
    //@+node:felix.20221120001229.22: *4* LeoGui.ensure_commander_visible
    /**
     * E.g. if commanders are in tabs, make sure c's tab is visible
     */
    public ensure_commander_visible(c: Commands): void {
        // pass
    }
    //@+node:felix.20221120001229.23: *4* LeoGui.finishCreate
    public finishCreate(): void {
        // This may be overridden in subclasses.
        // pass
    }
    //@+node:felix.20221120001229.24: *4* LeoGui.killPopupMenu & postPopupMenu
    public postPopupMenu(...args: any[]): void {
        // pass
    }
    //@+node:felix.20221120001229.25: *4* LeoGui.oops
    public oops(): any {
        // It is not usually an error to call methods of this class.
        // However, this message is useful when writing gui plugins.
        if (1) {
            g.pr(
                'LeoGui oops',
                g.callers(4),
                'should be overridden in subclass'
            );
        }
    }
    //@+node:felix.20221120001229.26: *4* LeoGui.put_help
    public put_help(c: Commands, s: string, short_title: string): void {
        // pass
    }
    //@+node:felix.20221120001229.27: *4* LeoGui.widget_name (LeoGui)
    public widget_name(w: any): string {
        // First try the widget's getName method.
        if (!w) {
            return '<no widget>';
        }
        if (w['getName']) {
            return w.getName();
        }
        if (w['_name']) {
            return w._name;
        }
        return w.toString();
    }
    //@-others
}

//@+node:felix.20220204224240.1: ** class NullGui
/**
 * Null gui class.
 */
export class NullGui extends LeoGui {
    public clipboardContents: string = '';
    public isNullGui: boolean = true;
    public focusWidget: StringTextWrapper | undefined;
    public config: any; // configuration service singleton for a specific external UI (e.g.: leojs)

    /**
     * ctor for the NullGui class.
     */
    constructor(guiName = 'nullGui') {
        super(guiName);
        this.clipboardContents = '';
        this.focusWidget = undefined;
        this.script = undefined;
        this.lastFrame = undefined; // The outer frame, to set g.app.log in runMainLoop.
        this.isNullGui = true;
        this.idleTimeClass = g.NullObject;
    }

    public makeAllBindings(): void { }
    public finishStartup(): void { }

    public launchRefresh(): void { }
    public fullRefresh(p_keepFocus?: boolean): void { }

    public replaceClipboardWith(s: string): Thenable<string> {
        this.clipboardContents = s; // also set immediate clipboard string
        return Promise.resolve(s);
    }

    public asyncGetTextFromClipboard(): Thenable<string> {
        return Promise.resolve(this.clipboardContents);
    }

    public getTextFromClipboard(): string {
        return this.clipboardContents;
    }

    public getFullVersion(): string {
        return 'LeoJS NullGui';
    }

    public addLogPaneEntry(...args: any[]): void {
        g.logBuffer.push(...args);
        console.log('NullGui:', ...args);
    }

    public show_find_success(
        c: Commands,
        in_headline: boolean,
        insert: number,
        p: Position
    ): void {
        //
    }

    public setLeoIDCommand(): void {
        //
    }

    public widget_name(widget: any): string {
        return '';
    }
    public set_focus(commander: Commands, widget: any): void {
        //
    }
    public get_focus(c?: Commands): any {
        return;
    }

    public interactiveSearch(
        p_backward: boolean,
        p_regex: boolean,
        p_word: boolean
    ): Promise<unknown> {
        return Promise.resolve();
    }

    public runAboutLeoDialog(
        c: Commands,
        version: string,
        theCopyright: string,
        url: string,
        email: string
    ): Thenable<unknown> {
        return Promise.resolve('');
    }

    public runOpenFileDialog(
        c: Commands,
        title: string,
        filetypes: [string, string][],
        defaultExtension: string,
        multiple?: boolean
    ): Thenable<string[] | string> {
        return Promise.resolve([]);
    }

    public runSaveFileDialog(
        c: Commands,
        title: string,
        filetypes: [string, string][],
        defaultExtension: string
    ): Thenable<string> {
        return Promise.resolve('');
    }

    public runAskOkDialog(
        c: Commands,
        title: string,
        message: string,
        buttonText?: string
    ): Thenable<unknown> {
        return Promise.resolve('');
    }

    public runAskYesNoDialog(
        c: Commands,
        title: string,
        message: string,
        yes_all?: boolean,
        no_all?: boolean
    ): Thenable<string> {
        return Promise.resolve('');
    }

    public runAskYesNoCancelDialog(
        c: Commands,
        title: string,
        message: string,
        yesMessage = 'Yes',
        noMessage = 'No',
        yesToAllMessage = '',
        defaultButton = 'Yes',
        cancelMessage = ''
    ): Thenable<string> {
        return Promise.resolve('');
    }

    public createLeoFrame(c: Commands, title: string): LeoFrame {
        return new LeoFrame(c, title, this);
    }

    public showLeoIDMessage(): void {
        // pass
    }

    public getIdFromSetting(): string {
        return '';
    }

    public getIdFromDialog(): Thenable<string> {
        return Promise.resolve('');
    }

    public ensure_commander_visible(c: Commands): void { }

    public isTextWidget(w: any): boolean {
        return w instanceof StringTextWrapper;
    }

    public isTextWrapper(w: any): boolean {
        return w instanceof StringTextWrapper;
    }
}

//@+node:felix.20221120015126.1: ** class NullScriptingControllerClass
/**
 * A default, do-nothing class to be overridden by mod_scripting or other plugins.
 */
class NullScriptingControllerClass {
    public c: Commands;
    public iconBar: any;

    constructor(c: Commands, iconBar?: any) {
        this.c = c;
        this.iconBar = iconBar;
    }

    public createAllButtons(): void {
        //pass
    }
}
//@-others
//@@language typescript
//@@tabwidth -4
//@@pagewidth 70
//@-leo
