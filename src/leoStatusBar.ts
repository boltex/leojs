import * as vscode from "vscode";
import { Constants } from "./constants";
import { LeoUI } from "./leoUI";
import * as g from './core/leoGlobals';

/**
 * * Statusbar indicator controller service
 */
export class LeoStatusBar {

    private _leoStatusBarItem: vscode.StatusBarItem;
    private _updateStatusBarTimeout: NodeJS.Timeout | undefined;
    private _string: string = ""; // Use this string with indicator, using this will replace the defult from config
    private _tooltip: string = ""; // Markdown string built by _buildToolTip from a given headeline

    // * Represents having focus on a leo tree, body or document panel to enable leo keybindings
    private _statusBarFlag: boolean = false;
    set statusBarFlag(p_value: boolean) {
        this._statusBarFlag = p_value;
    }
    get statusBarFlag(): boolean {
        return this._statusBarFlag;
    }

    constructor(
        private _context: vscode.ExtensionContext,
        private _leoJs: LeoUI
    ) {
        this._leoStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
        this._context.subscriptions.push(this._leoStatusBarItem); // Disposable 

        // this._leoStatusBarItem.color = Constants.GUI.STATUSBAR_COLOR;
        this._leoStatusBarItem.command = Constants.COMMANDS.STATUS_BAR;
        this._leoStatusBarItem.text = Constants.GUI.STATUSBAR_INDICATOR;


        const w_mdToolTip = new vscode.MarkdownString();

        w_mdToolTip.value = "";

        w_mdToolTip.isTrusted = true;
        w_mdToolTip.supportThemeIcons = true;

        this._leoStatusBarItem.tooltip = Constants.USER_MESSAGES.STATUSBAR_TOOLTIP_UNL;
        this._leoStatusBarItem.tooltip = w_mdToolTip;


        this._leoStatusBarItem.hide();
    }

    /**
     * * Makes the statusbar indicator visible
     */
    public show(): void {
        this._leoStatusBarItem.show();
    }

    /**
     * * Hides the statusbar indicator
     */
    public hide(): void {
        this._leoStatusBarItem.hide();
    }

    /**
     * * Sets string to replace default from config & refresh it
     * @p_string string to be displayed on Leo's status bar space.
     * @param p_debounceDelay Optional, in milliseconds
     * 
     */
    public setString(p_string: string, p_debounceDelay?: number): void {
        if (this._string === p_string) {
            return; // cancel
        }
        this._string = p_string;
        this._updateLeoObjectIndicatorDebounced(p_debounceDelay || 0);
    }
    /**
     * Sets up the tooltip with a given headline string title
     * for displaying 'click to copy to clipboard' tooltip
     */
    public setTooltip(p_headline: string, p_debounceDelay?: number): void {
        if (this._tooltip === p_headline) {
            return; // cancel
        }
        this._tooltip = this._buildToolTip(p_headline);
        this._updateLeoObjectIndicatorDebounced(p_debounceDelay || 0);
    }

    /**
     * builds tooltip from headline
     */
    private _buildToolTip(p_headline: string = ""): string {

        // markdown supports links that execute commands: 
        // [Run it](command:myCommandId)

        let w_tooltip = g.dedent(`\
        #### **UNL for** _${p_headline}_

        #### [Click to copy UNL to clipboard](command:${Constants.COMMANDS.STATUS_BAR})

        ---

        _Or choose a specific UNL type:_

        **[short gnx](command:${Constants.COMMANDS.SHORT_GNX_UNL_TO_CLIPBOARD})** —
        **[full gnx](command:${Constants.COMMANDS.FULL_GNX_UNL_TO_CLIPBOARD})**

        **[short legacy](command:${Constants.COMMANDS.SHORT_LECACY_UNL_TO_CLIPBOARD})** —
        **[full legacy](command:${Constants.COMMANDS.FULL_LEGACY_UNL_TO_CLIPBOARD})**

        `);

        return w_tooltip;

    }

    /**
     * * Updates the status bar visual indicator flag in a debounced manner
     * @param p_delay number of milliseconds
     */
    private _updateLeoObjectIndicatorDebounced(p_delay: number): void {
        if (this._updateStatusBarTimeout) {
            clearTimeout(this._updateStatusBarTimeout);
        }
        this._updateStatusBarTimeout = setTimeout(() => {
            this._updateLeoObjectIndicator();
        }, p_delay);
    }

    /**
     * * Updates the status bar visual indicator flag directly
     */
    private _updateLeoObjectIndicator(): void {
        // Can be called directly, so clear timer if any
        if (this._updateStatusBarTimeout) {
            clearTimeout(this._updateStatusBarTimeout);
        }
        this._leoStatusBarItem.text = Constants.GUI.STATUSBAR_INDICATOR + this._string;
        (this._leoStatusBarItem.tooltip as vscode.MarkdownString).value = this._tooltip;
    }

}
