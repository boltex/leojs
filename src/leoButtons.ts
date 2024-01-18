import * as vscode from "vscode";
import { Icon, LeoButton } from "./types";
import { Constants } from "./constants";
import { LeoStates } from "./leoStates";
import * as g from './core/leoGlobals';
import { RClick } from "./core/mod_scripting";
import { nullButtonWidget } from "./core/leoFrame";

/**
 * * '@buttons' shown as a list with this TreeDataProvider implementation
 */
export class LeoButtonsProvider implements vscode.TreeDataProvider<LeoButtonNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<LeoButtonNode | undefined> = new vscode.EventEmitter<LeoButtonNode | undefined>();

    readonly onDidChangeTreeData: vscode.Event<LeoButtonNode | undefined> = this._onDidChangeTreeData.event;

    constructor(
        private _leoStates: LeoStates,
        private _icons: Icon[],
    ) { }

    /**
     * * Refresh the whole outline
     */
    public refreshTreeRoot(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    public getTreeItem(element: LeoButtonNode): Thenable<LeoButtonNode> | LeoButtonNode {
        return element;
    }

    public getChildren(element?: LeoButtonNode): Thenable<LeoButtonNode[]> {
        const w_children: LeoButtonNode[] = [];
        // if called with element, or not ready, give back empty array as there won't be any children
        if (this._leoStates.fileOpenedReady && !element) {

            const c = g.app.windowList[g.app.gui.frameIndex].c;

            let d: nullButtonWidget[];
            if (c && c.theScriptingController) {
                d = c.theScriptingController.buttonsArray || [];
            } else {
                d = [];
            }

            const buttons = [];

            let i_but = 0;
            for (const but of d) {
                let rclickList: RClick[] = [];

                if (but.rclicks) {
                    rclickList = but.rclicks;
                }

                const entry: LeoButton = {
                    name: but.text,
                    index: i_but,
                    rclicks: rclickList,
                };

                buttons.push(entry);
                i_but += 1;
            }


            buttons.forEach(p_button => {
                w_children.push(new LeoButtonNode(p_button, this._icons));
            });


        }
        return Promise.resolve(w_children); // Defaults to an empty list of children
    }

    public getParent(element: LeoButtonNode): vscode.ProviderResult<LeoButtonNode> | null {
        // Buttons are just a list, as such, entries are always child of root so return null
        return null;
    }

}

/**
 * * Leo @buttons tree view node item implementation, for usage in a TreeDataProvider.
 */
export class LeoButtonNode extends vscode.TreeItem {

    // Context string that is checked in package.json with 'when' clauses
    public contextValue: string;
    public rclicks: RClick[];

    // is the special 'add' button used to create button from a given node's script
    private _isAdd: boolean;

    constructor(
        public button: LeoButton,
        private _buttonIcons: Icon[], // pointer to global array of node icons
    ) {
        super(button.name);

        this._isAdd = this.button.name === Constants.BUTTON_STRINGS.SCRIPT_BUTTON;

        this.rclicks = button.rclicks ? button.rclicks : [];
        this.contextValue = this._isAdd ? Constants.BUTTON_STRINGS.ADD_BUTTON : Constants.BUTTON_STRINGS.NORMAL_BUTTON;

    }

    // @ts-ignore
    public get iconPath(): Icon {
        return this._buttonIcons[this._isAdd ? 2 : this.rclicks.length ? 1 : 0];
    }

    // @ts-ignore
    public get id(): string {
        // Add prefix and suffix salt to index to prevent accidental duplicates
        return "p" + this.button.index + "s" + this.button.name;
    }

    // @ts-ignore
    public get tooltip(): string {
        if (this._isAdd) {
            return Constants.USER_MESSAGES.SCRIPT_BUTTON_TOOLTIP;
        } else {
            return this.button.name;
        }
    }

    // @ts-ignore
    public get description(): string | boolean {
        if (this._isAdd) {
            return Constants.USER_MESSAGES.SCRIPT_BUTTON;
        } else {
            return false;
        }
    }

}


