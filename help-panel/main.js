// @ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
// Send message to LeoJS with vscode.postMessage({ keyNameEx1: someValue, ... });
// Receive messages from LeoJS with window.addEventListener('message', event => { ... });
(function () {
    // @ts-expect-error
    const vscode = acquireVsCodeApi();

    // console.log('Help Panel Started!');
})();
