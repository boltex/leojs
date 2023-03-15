// @ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
// Send message to LeoJS with vscode.postMessage({ keyNameEx1: someValue, ... });
// Receive messages from LeoJS with window.addEventListener('message', event => { ... });
(function () {
    // @ts-expect-error
    const vscode = acquireVsCodeApi();



    // Handle messages sent from the extension to the webview
    window.addEventListener('message', (event) => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {

        }
    });

    vscode.postMessage({ type: 'refreshSearchConfig' });
})();
