//@+leo-ver=5-thin
//@+node:felix.20220129002501.1: * @file src/test/example.test.ts
import * as assert from 'assert';

// * You can import and use all API from the 'vscode' module
// * as well as import your extension to test it

import * as vscode from 'vscode';

import * as g from '../core/leoGlobals';
import { Commands } from "../core/leoCommands";
import { NodeIndices, VNode, Position } from '../core/leoNodes';


suite('Extension test examples', () => {

	test('Sample test', () => {
		assert.strictEqual([1, 2, 3].indexOf(5), -1);
		assert.strictEqual([1, 2, 3].indexOf(0), -1);
	});

	// * Example tests for leojs
	vscode.window.showInformationMessage('Starting leojs sample tests');

	let commanderIndex: number = 0;
	let w_c: Commands;
	let w_v: VNode;
	let w_p: Position;
	let c: Commands;

	test('ASSERT g and g.app', () => {
		assert.strictEqual(!!g, true, "g exists");
		assert.strictEqual(!!g.app, true, "g.app exists");
	});

	test('SETUP LEO APP', () => {
		console.log('in examples test before g.app.leoID is ', g.app.leoID);

		if (!g.app.setLeoID(false, true)) {
			throw new Error("unable to set LeoID.");
		}

		assert.strictEqual(!!g.app.leoID, true, "leoID exists");

		g.app.inBridge = true;  // (From Leo) Added 2007/10/21: support for g.getScript.
		g.app.nodeIndices = new NodeIndices(g.app.leoID);

		console.log('in examples test after g.app.leoID is ', g.app.leoID);

	});

	test('CREATE NEW LEO OUTLINE: NEW COMMANDER', () => {

		w_c = g.app.newCommander("");
		assert.strictEqual(!!w_c, true, 'Created Commander Exists');

		// Equivalent to leoBridge 'createFrame' method
		w_v = new VNode(w_c);
		assert.strictEqual(!!w_v, true, 'Created VNode Exists');

		w_p = new Position(w_v);
		assert.strictEqual(!!w_p && w_p.__bool__(), true, 'Created Position Exists');

		w_v.initHeadString("NewHeadline");

		// #1631: Initialize here, not in p._linkAsRoot.
		w_c.hiddenRootNode.children = [];

		// New in Leo 4.5: p.moveToRoot would be wrong: the node hasn't been linked yet.
		w_p._linkAsRoot();

		g.app.commanders().push(w_c);

		// select first test commander
		c = g.app.commanders()[commanderIndex];
		assert.strictEqual(!!c, true, 'Global Test Commander Exists 1');

	});
	test('BUILD SOME TEST OUTLINE', () => {
		assert.strictEqual(!!c, true, 'Global Test Commander Exists 2');
		w_p = c.p;
		w_p.initHeadString("@file node1");
		w_p.setBodyString('@tabwidth 8\nnode1 body\n@others');
		w_p.expand();
		w_p = c.p.insertAsLastChild();
		w_p.initHeadString("node Inside1");
		w_p.setBodyString('  @others \nnodeInside1 body\n@language c\nprint()');
		w_p.setMarked();
		w_p = c.p.insertAsLastChild();
		w_p.initHeadString("node with UserData Inside2");
		w_p.setBodyString('node Inside2 body');
		w_p.u = { a: 'user content string a', b: "user content also" };
		w_p = c.p.insertAfter();
		w_p.initHeadString("@file node3");
		w_p.setBodyString('node 3 body');
		w_p = c.p.insertAfter();
		w_p.initHeadString("node 2 selected but empty");
		w_c.setCurrentPosition(w_p);
	});


});
//@-leo
