//@+leo-ver=5-thin
//@+node:felix.20220129002501.1: * @file src/test/extension.test.ts
import * as assert from 'assert';
import { before } from 'mocha';

// * You can import and use all API from the 'vscode' module
// * as well as import your extension to test it

import * as vscode from 'vscode';
import { Constants } from '../constants';

suite('Extension test examples', () => {

	// * Example tests for leojs

	before(async () => {
		let w_wait: number = 5000;

		vscode.window.showInformationMessage(`Starting leojs extension tests in ${w_wait} ms`);

		return new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve();
			}, w_wait);
		});
	});

	test('Test leojs Extension with exposed commands', async () => {
		vscode.window.showInformationMessage('Starting leojs extension tests now!');

		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));

		// 1 - show/open leo panel
		await vscode.commands.executeCommand(
			Constants.COMMANDS.SHOW_OUTLINE
		);
		// 2 - create new documents and nodes 
		await vscode.commands.executeCommand(
			"leojs.test"
		);

		// 3 - test outline editing commands
		await vscode.commands.executeCommand(
			Constants.COMMANDS.MOVE_UP_SELECTION_FO
		);
		await vscode.commands.executeCommand(
			Constants.COMMANDS.MARK_SELECTION_FO
		);

		// 4 - test undos, other gui commands & miscellaneous
		await vscode.commands.executeCommand(
			Constants.COMMANDS.UNDO_FO
		);
		await vscode.commands.executeCommand(
			Constants.COMMANDS.UNDO_FO
		);

		// TODO: more tests
		// 5 - test 'new' leojs document and repeat tests

	});

});
//@-leo
