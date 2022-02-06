//@+leo-ver=5-thin
//@+node:felix.20220129002501.1: * @file src/test/extension.test.ts
import * as assert from 'assert';
import { before } from 'mocha';

// * You can import and use all API from the 'vscode' module
// * as well as import your extension to test it

import * as vscode from 'vscode';

suite('Extension test examples', () => {

	// * Example tests for leojs

	before(async () => {
		vscode.window.showInformationMessage('Starting leojs extension tests in 1000 ms');
		// Wait 1 second
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve();
			}, 1000);
		});
	});

	test('Test Extension with it\'s exposed commands', async () => {
		vscode.window.showInformationMessage('TODO : Write tests with vscode!');

		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

});
//@-leo
