import * as vscode from 'vscode';
import { JsOutlineProvider } from './leoOutline';

// - `src/extension.ts` - this is the main file where you will provide the implementation of your command.
//   - The file exports one function, `activate`, which is called the very first time your extension is activated (in this case by executing the command).
//     Inside the `activate` function we call `registerCommand`.
//   - We pass the function containing the implementation of the command as the second parameter to `registerCommand`.

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "leojs" is now active!');

	const jsOutlineProvider = new JsOutlineProvider(context);
	vscode.window.registerTreeDataProvider('leoJsExplorer', jsOutlineProvider);
	vscode.commands.executeCommand('setContext', 'leoReady', true);
	vscode.commands.executeCommand('setContext', 'leoTreeOpened', true);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('leojs.test', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from leojs!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }


