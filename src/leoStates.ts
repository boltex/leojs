import * as vscode from "vscode";
import * as utils from "./utils";
import { LeoUI } from "./leoUI";
import { Constants } from "./constants";
import { LeoPackageStates } from "./types";
import { Position } from "./core/leoNodes";

/**
 * * Global states service
 * Holds state flags used to restrict command availability and icon visibility
 * Changes UI by changing vscode's context variables
 */
export class LeoStates {

    /**
     * General 'Leo is ready' state
     */
    private _leoReady: boolean = false;
    get leoReady(): boolean {
        return this._leoReady;
    }
    set leoReady(p_value: boolean) {
        this._leoReady = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.LEO_READY, p_value);
    }

    /**
     * A Leo file is opened
     */
    private _fileOpenedReady: boolean = false; // Sets context flag along with treeview title
    get fileOpenedReady(): boolean {
        return this._fileOpenedReady;
    }
    set fileOpenedReady(p_value: boolean) {
        this._fileOpenedReady = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.TREE_OPENED, p_value);
    }


    /**
     * Currently opened Leo file path and name, empty string if new unsaved file.
     */
    private _leoOpenedFileName: string = "";
    get leoOpenedFileName(): string {
        return this._leoOpenedFileName;
    }
    set leoOpenedFileName(p_name: string) {
        if (p_name && p_name.length) {
            this._leoOpenedFileName = p_name;
            utils.setContext(Constants.CONTEXT_FLAGS.TREE_TITLED, true);
        } else {
            this._leoOpenedFileName = "";
            utils.setContext(Constants.CONTEXT_FLAGS.TREE_TITLED, false);
        }
    }


    /**
     * Currently opened commander is dirty
     */
    private _leoChanged: boolean = false;
    get leoChanged(): boolean {
        return this._leoChanged;
    }
    set leoChanged(p_value: boolean) {
        if (this._leoChanged !== p_value) {
            // Refresh Documents Panel
            // ? Needed?
            this._leoJs.refreshDocumentsPane();
        }
        this._leoChanged = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.LEO_CHANGED, p_value);
    }

    /**
     * Undo operation available state
     */
    private _leoCanUndo: boolean = false;
    get leoCanUndo(): boolean {
        return this._leoCanUndo;
    }
    set leoCanUndo(p_value: boolean) {
        this._leoCanUndo = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.LEO_CAN_UNDO, p_value);
    }

    /**
     * Redo operation available state
     */
    private _leoCanRedo: boolean = false;
    get leoCanRedo(): boolean {
        return this._leoCanRedo;
    }
    set leoCanRedo(p_value: boolean) {
        this._leoCanRedo = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.LEO_CAN_REDO, p_value);
    }

    /**
     * Current selection allows demote command
     */
    private _leoCanDemote: boolean = false;
    get leoCanDemote(): boolean {
        return this._leoCanDemote;
    }
    set leoCanDemote(p_value: boolean) {
        this._leoCanDemote = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.LEO_CAN_DEMOTE, p_value);
    }

    /**
     * Current selection allows promote command
     */
    private _leoCanPromote: boolean = false;
    get leoCanPromote(): boolean {
        return this._leoCanPromote;
    }
    set leoCanPromote(p_value: boolean) {
        this._leoCanPromote = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.LEO_CAN_PROMOTE, p_value);
    }

    /**
     * Currently selected can de-hoist state
     */
    private _leoCanDehoist: boolean = false;
    get leoCanDehoist(): boolean {
        return this._leoCanDehoist;
    }
    set leoCanDehoist(p_value: boolean) {
        this._leoCanDehoist = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.LEO_CAN_DEHOIST, p_value);
    }

    // * 'states' flags about current selection, for visibility and commands availability
    private _leoMarked: boolean = false;
    get leoMarked(): boolean {
        return this._leoMarked;
    }
    set leoMarked(p_value: boolean) {
        this._leoMarked = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_MARKED, p_value);
    }

    private _leoCloned: boolean = false;
    get leoCloned(): boolean {
        return this._leoCloned;
    }
    set leoCloned(p_value: boolean) {
        this._leoCloned = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_CLONE, p_value);
    }

    private _leoDirty: boolean = false;
    get leoDirty(): boolean {
        return this._leoDirty;
    }
    set leoDirty(p_value: boolean) {
        this._leoDirty = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_DIRTY, p_value);
    }

    private _leoEmpty: boolean = false;
    get leoEmpty(): boolean {
        return this._leoEmpty;
    }
    set leoEmpty(p_value: boolean) {
        this._leoEmpty = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_EMPTY, p_value);
    }

    private _leoChild: boolean = false;
    get leoChild(): boolean {
        return this._leoChild;
    }
    set leoChild(p_value: boolean) {
        this._leoChild = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_CHILD, p_value);
    }

    private _leoAtFile: boolean = false;
    get leoAtFile(): boolean {
        return this._leoAtFile;
    }
    set leoAtFile(p_value: boolean) {
        this._leoAtFile = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_ATFILE, p_value);
    }

    // * Special is-root 'state' flag about current selection, for visibility and commands availability
    private _leoRoot: boolean = false;
    get leoRoot(): boolean {
        return this._leoRoot;
    }
    set leoRoot(p_value: boolean) {
        this._leoRoot = p_value;
        utils.setContext(Constants.CONTEXT_FLAGS.SELECTED_ROOT, p_value);
    }

    constructor(
        private _context: vscode.ExtensionContext,
        private _leoJs: LeoUI
    ) { }

    public setSelectedNodeFlags(p_node: Position): void {
        this.leoRoot = false; // * RESET the root flag : It is set by vscode instead right after getting list of children for root of outline
        this.leoMarked = p_node.isMarked();
        this.leoCloned = p_node.isCloned();
        this.leoDirty = p_node.isDirty();
        this.leoEmpty = !p_node.v.hasBody();
        this.leoChild = p_node.hasChildren();
        this.leoAtFile = p_node.isAtFileNode();
    }

    public setLeoStateFlags(p_states: LeoPackageStates): void {
        this.leoChanged = p_states.changed;
        this.leoCanUndo = p_states.canUndo;
        this.leoCanRedo = p_states.canRedo;
        this.leoCanDemote = p_states.canDemote;
        this.leoCanPromote = p_states.canPromote;
        this.leoCanDehoist = p_states.canDehoist;
    }
}
