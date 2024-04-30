import * as vscode from "vscode";
import { Constants } from "./constants";
import * as utils from "./utils";
import { LeoBodyProvider } from "./leoBody";
import { LeoBodyDetachedProvider } from "./leoBodyDetached";
import { VNode } from "./core/leoNodes";

export class LeoBodyDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    constructor(
        private _leoBody: LeoBodyProvider,
        private _leoDetached: LeoBodyDetachedProvider
    ) { }

    public provideDocumentSymbols(
        document: vscode.TextDocument, token: vscode.CancellationToken):
        Thenable<vscode.SymbolInformation[]> {

        const w_gnx = utils.leoUriToStr(document.uri);
        let v: VNode | undefined;
        let fileProvider;
        if (
            document.uri.scheme === Constants.URI_LEOJS_SCHEME
        ) {
            fileProvider = this._leoBody;
        } else {
            fileProvider = this._leoDetached;
        }
        v = fileProvider.openedBodiesVNodes[w_gnx];
        if (v) {

            const c = v.context;

            // const filename = c.shortFileName() || 'untitled';
            const headline = v.headString();

            // Get the last line number & last character index of the last line
            const lastLineIndex = document.lineCount - 1;
            const lastCharIndex = document.lineAt(lastLineIndex).text.length;
            const loc = new vscode.Location(document.uri, new vscode.Range(0, 0, lastLineIndex, lastCharIndex));

            const breadcrumbInfo = new vscode.SymbolInformation(

                // * BOTH
                // filename + " > " + headline, vscode.SymbolKind.String, "", loc

                // * HEADLINE ONLY
                headline, vscode.SymbolKind.String, "", loc

            );
            return Promise.resolve([breadcrumbInfo]);
        }
        return Promise.resolve([]);

    }
}
