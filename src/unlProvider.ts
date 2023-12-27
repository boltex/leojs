import * as vscode from 'vscode';

export class UnlProvider implements vscode.DocumentLinkProvider {
    private gnxUnlRegex = /\bunl:gnx:\/\/[^\s]+/g;
    private headlineUnlRegex = /\bunl:\/\/(?:[^\s#]*#)?(?:[^-->]+(?:-->[^-->]+)*)/g;

    public provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
        const text = document.getText();
        const links: vscode.DocumentLink[] = [];

        // GNX-based UNLs
        let match;
        while ((match = this.gnxUnlRegex.exec(text)) !== null) {
            const range = new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length));
            const args = encodeURIComponent(JSON.stringify({ unl: match[0] }));
            links.push(new vscode.DocumentLink(range, vscode.Uri.parse(`command:leojs.handleUnl?${args}`)));
        }

        // Headline-based UNLs
        while ((match = this.headlineUnlRegex.exec(text)) !== null) {
            const range = new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length));
            const args = encodeURIComponent(JSON.stringify({ unl: match[0] }));
            links.push(new vscode.DocumentLink(range, vscode.Uri.parse(`command:leojs.handleUnl?${args}`)));
        }

        return links;
    }
}
