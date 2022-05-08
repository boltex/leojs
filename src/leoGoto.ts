import * as vscode from "vscode";
import { Constants } from "./constants";
import { LeoUI } from "./leoUI";
import { LeoGoto, TGotoTypes } from "./types";
import * as utils from "./utils";

/**
 * * Opened Leo documents shown as a list with this TreeDataProvider implementation
 */
export class LeoGotoProvider implements vscode.TreeDataProvider<LeoGotoNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<LeoGotoNode | undefined> = new vscode.EventEmitter<LeoGotoNode | undefined>();

    readonly onDidChangeTreeData: vscode.Event<LeoGotoNode | undefined> = this._onDidChangeTreeData.event;

    private _lastGotoView: vscode.TreeView<LeoGotoNode> | undefined;

    private _topNode: LeoGotoNode | undefined;

    constructor(private _leoUI: LeoUI) { }

    public showGotoPanel(): Thenable<void> {
        if (this._lastGotoView && this._topNode) {
            return this._lastGotoView.reveal(this._topNode, { select: false, focus: false });
        }
        return Promise.resolve();
    }

    public setLastGotoView(p_view: vscode.TreeView<LeoGotoNode>): void {
        this._lastGotoView = p_view;
    }

    /**
     * * Refresh the whole outline
     */
    public refreshTreeRoot(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    public getTreeItem(element: LeoGotoNode): Thenable<LeoGotoNode> | LeoGotoNode {
        return element;
    }

    public getChildren(element?: LeoGotoNode): Thenable<LeoGotoNode[]> {

        // if called with element, or not ready, give back empty array as there won't be any children
        if (this._leoUI.leoStates.fileOpenedReady && !element) {

            // TODO !
            return Promise.resolve([]);

            /* 

            // call action to get get list, and convert to LeoButtonNode(s) array
            return this._leoUI.sendAction(Constants.LEOBRIDGE.GET_GOTO_PANEL).then(p_package => {
                if (p_package && p_package.navList) {

                    const w_list: LeoGotoNode[] = [];
                    this._topNode = undefined;
                    const w_navList: LeoGoto[] = p_package.navList;
                    if (w_navList && w_navList.length) {
                        w_navList.forEach((p_goto: LeoGoto) => {
                            const w_newNode = new LeoGotoNode(this._leoUI, p_goto, p_package.navOptions!);
                            if (!this._topNode) {
                                this._topNode = w_newNode;
                            }
                            w_list.push(w_newNode);
                        });
                    }
                    return w_list;
                } else {
                    return [];
                }
            });

            */

        } else {
            return Promise.resolve([]); // Defaults to an empty list of children
        }
    }

    public getParent(element: LeoGotoNode): vscode.ProviderResult<LeoGotoNode> | null {
        // Leo documents are just a list, as such, entries are always child of root, so return null
        return null;
    }

}
/**
 * * Opened Leo documents tree view node item implementation for usage in a TreeDataProvider
 */
export class LeoGotoNode extends vscode.TreeItem {

    // Context string is checked in package.json with 'when' clauses
    public entryType: TGotoTypes;
    private _id: string;
    private _description: string | boolean;
    private _headline: string;
    private _iconIndex: number; // default to tag
    private _leoUI: LeoUI;
    public key: number; // id from python

    constructor(
        p_leoUI: LeoUI,
        p_gotoEntry: LeoGoto,
        p_navOptions: { isTag: boolean, showParents: boolean },

    ) {
        let w_spacing = "";
        if (p_navOptions.showParents && !p_navOptions.isTag) {
            w_spacing = "    ";
        }
        let w_label = "";
        if (["tag", "headline"].includes(p_gotoEntry.t)) {
            w_label = w_spacing + p_gotoEntry.h;
        }
        super(w_label);

        // Setup this instance
        this._leoUI = p_leoUI;
        this._id = utils.getUniqueId();
        this.entryType = p_gotoEntry.t;
        this.key = p_gotoEntry.key;
        this._headline = p_gotoEntry.h.trim();

        this._description = false;
        if (this.entryType === 'body') {
            this._iconIndex = 2;
            if (p_navOptions.showParents) {
                this._description = "    " + this._headline;
            } else {
                this._description = "  " + this._headline;
            }
        } else if (this.entryType === 'parent') {
            this._iconIndex = 0;
            this._description = this._headline.trim();
        } else if (this.entryType === 'generic') {
            this._iconIndex = 4;
            this._description = this._headline;
        } else if (this.entryType === 'headline') {
            this._iconIndex = 1;
        } else {
            this._iconIndex = 3; // tag
        }

        this.command = {
            command: Constants.COMMANDS.GOTO_NAV_ENTRY,
            title: '',
            arguments: [this]
        };

    }

    // @ts-ignore
    public get tooltip(): string {
        if (this.entryType !== "generic") {
            return this.entryType.charAt(0).toUpperCase() + this.entryType.slice(1);
        }
        return this._headline;
    }

    // @ts-ignore
    public get description(): string | boolean {
        return this._description;
    }

    // @ts-ignore
    public get iconPath(): Icon | vscode.ThemeIcon | string {
        if (this._iconIndex < 4) {
            return this._leoUI.gotoIcons[this._iconIndex];
        }
        // else return undefined for generic text without icon
        return undefined;
    }

    // @ts-ignore
    public get id(): string {
        // Add prefix and suffix salt to numeric index to prevent accidental duplicates
        // Should be unique when refreshed
        return "g" + this._id + "o";
    }

}