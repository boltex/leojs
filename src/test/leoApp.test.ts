//@+leo-ver=5-thin
//@+node:felix.20220129200448.1: * @file src/test/leoApp.test.ts
import * as assert from 'assert';
import { after } from 'mocha';

import * as vscode from 'vscode';


suite('Trying leoApp.test', () => {
  after(() => {
    vscode.window.showInformationMessage('From inside leoApp.test!');
  });

  test('actual leoApp test', () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});
//@-leo
