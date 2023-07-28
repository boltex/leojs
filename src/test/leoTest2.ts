//@+leo-ver=5-thin
//@+node:felix.20220130224933.1: * @file src/test/leoTest2.ts

//@@language typescript
//@@tabwidth -4

/**
 * Support for LeoJS's new unit tests, contained in src/tests/.
 */

import * as path from 'path';
import * as os from 'os';
import * as g from '../core/leoGlobals';
import { LeoApp, LoadManager } from '../core/leoApp';
import { Commands } from "../core/leoCommands";
import { NodeIndices, VNode, Position } from '../core/leoNodes';
import { GlobalConfigManager } from '../core/leoConfig';
import { NullGui } from '../core/leoGui';
import * as assert from 'assert';
import { ISettings } from '../core/leoFind';
import { AtFile } from '../core/leoAtFile';

//@+others
//@+node:felix.20220130224933.2: ** function.create_app
/**
 * Create the Leo application, g.app, the Gui, g.app.gui, and a commander.
 *
 * This method is expensive (0.5 sec) only the first time it is called.
 *
 * Thereafter, recreating g.app, g.app.gui, and new commands is fast.
 */
export async function create_app(gui_name: string = 'null'): Promise<Commands> {

    let trace = false;
    const t1 = process.hrtime();
    //
    // Set g.unitTesting *early*, for guards, to suppress the splash screen, etc.
    (g.unitTesting as boolean) = true;
    // Create g.app now, to avoid circular dependencies.
    (g.app as LeoApp) = new LeoApp();
    // Late imports.
    // warnings.simplefilter("ignore")
    // from leo.core import leoConfig
    // from leo.core import leoNodes
    // from leo.core import leoCommands
    // from leo.core.leoGui import NullGui
    // if gui_name == 'qt':
    //     from leo.plugins.qt_gui import LeoQtGui
    // t2 = time.process_time()


    const lm = new LoadManager();
    g.app.loadManager = lm;

    // g.app.recentFilesManager = leoApp.RecentFilesManager()

    await lm.computeStandardDirectories();

    g.app.leoID = 'TestLeoId';  // Use a standard user id for all tests.
    g.app.nodeIndices = new NodeIndices(g.app.leoID);
    g.app.config = new GlobalConfigManager();

    // g.app.db = g.NullObject('g.app.db')
    g.app.pluginsController = new g.NullObject('g.app.pluginsController');
    // g.app.commander_cacher = g.NullObject('g.app.commander_cacher')

    if (gui_name === 'null') {
        g.app.gui = new NullGui();
    }
    // else if gui_name == 'qt'
    //     g.app.gui = LeoQtGui()
    // else
    //     raise TypeError(f"create_gui: unknown gui_name: {gui_name!r}")

    const t3 = process.hrtime();
    // Create a dummy commander, to do the imports in c.initObjects.
    // Always use a null gui to avoid screen flash.
    // setUp will create another commander.
    const c = new Commands("", g.app.gui);

    // Create minimal config dictionaries.
    let settings_d;
    let bindings_d;
    [settings_d, bindings_d] = lm.createDefaultSettingsDicts();

    lm.globalSettingsDict = settings_d;
    lm.globalBindingsDict = bindings_d;
    c.config.settingsDict = settings_d;
    // c.config.bindingsDict = bindings_d;

    assert.strictEqual(g.unitTesting, true, 'unit testing is set');  // Defensive.

    const t4 = process.hrtime();

    // Trace times. This trace happens only once:
    //     imports: 0.016
    //         gui: 0.000
    //   commander: 0.469
    //       total: 0.484

    // if trace and t4 - t3 > 0.1:
    // print('create_app:\n'
    //         f"  imports: {(t2-t1):.3f}\n"
    //         f"      gui: {(t3-t2):.3f}\n"
    //         f"commander: {(t4-t2):.3f}\n"
    //         f"    total: {(t4-t1):.3f}\n")

    return c;
}

//@+node:felix.20220130224933.3: ** class LeoUnitTest(unittest.TestCase)
/**
 * The base class for all unit tests in Leo.
 *
 * Contains setUp/tearDown methods and various utilities.
 */
export class LeoUnitTest {

    public c!: Commands;
    public root_p!: Position;
    public settings_p!: Position;
    public x: any;
    public at!: AtFile;
    public settings!: ISettings;

    //@+others
    //@+node:felix.20220130224933.4: *3* LeoUnitTest.setUp, tearDown & setUpClass

    constructor() { }

    public setUpClass(): Promise<Commands> {
        return create_app('null');
    }

    /**
     * Create a commander using a **null** gui, regardless of g.app.gui.
     * Create the nodes in the commander.
     */
    public setUp(): void {
        // Set g.unitTesting *early*, for guards.
        (g.unitTesting as boolean) = true;

        // Default.
        g.app.write_black_sentinels = false;

        // Create a new commander for each test.
        // This is fast, because setUpClass has done all the imports.


        // fileName = g.os_path_finalize_join(g.app.loadDir, 'LeoPyRef.leo')
        const fileName = g.os_path_finalize_join(g.app.loadDir!, 'Leojs.leo');
        // const fileName = g.os_path_finalize_join(g.vsCodeContext.extensionUri.fsPath, 'Leojs.leo');

        const c = new Commands(fileName, new NullGui());
        this.c = c;
        // Init the 'root' and '@settings' nodes.
        this.root_p = c.rootPosition()!;
        this.root_p.h = 'root';
        this.settings_p = this.root_p.insertAfter();
        this.settings_p.h = '@settings';
        // Select the 'root' node.
        c.selectPosition(this.root_p);
    }

    public tearDown(): void {
        // unneeded ?
    }

    //@+node:felix.20230724005349.1: *3* LeoUnitTest: setup helpers and related tests
    //@+node:felix.20230724005349.2: *4* LeoUnitTest._set_setting
    /**
     * Call c.config.set with the given args, suppressing stdout.
     */
    public _set_setting(c: Commands, kind: string, name: string, val: any): void {

        c.config.set(undefined, kind, name, val);

        // try:
        //     old_stdout = sys.stdout
        //     sys.stdout = open(os.devnull, 'w')
        //     c.config.set(p=None, kind=kind, name=name, val=val)
        // catch(e){

        // }
        // finally{
        //     sys.stdout = old_stdout
        // }

    }

    //@+node:felix.20230724005349.3: *4* LeoUnitTest.verbose_test_set_setting
    public verbose_test_set_setting(): void {
        // Not run by default. To run:
        // python -m unittest leo.core.leoTest2.LeoUnitTest.verbose_test_set_setting
        const c = this.c;
        let val: any;
        let name = '';
        for (const w_val in [true, false]) {
            name = 'test-bool-setting';
            this._set_setting(c, 'bool', name, val);
            assert.ok(c.config.getBool(name) === val);
        }
        val = 'aString';
        this._set_setting(c, 'string', name, val);
        assert.ok(c.config.getString(name) === val);
    }
    //@+node:felix.20220130224933.5: *3* LeoUnitTest.create_test_outline
    public create_test_outline(): void {
        const p: Position = this.c!.p;
        // Create the following outline:
        //
        // root
        //   child clone a
        //     node clone 1
        //   child b
        //     child clone a
        //       node clone 1
        //   child c
        //     node clone 1
        //   child clone a
        //     node clone 1
        //   child b
        //     child clone a
        //       node clone 1
        assert.strictEqual(p.__eq__(this.root_p), true, 'P is root');
        assert.strictEqual(p.h, 'root', 'same headline: root');
        // Child a
        const child_clone_a = p.insertAsLastChild();
        child_clone_a.h = 'child clone a';
        const node_clone_1 = child_clone_a.insertAsLastChild();
        node_clone_1.h = 'node clone 1';
        // Child b
        const child_b = p.insertAsLastChild();
        child_b.h = 'child b';
        // Clone 'child clone a'
        let clone = child_clone_a.clone();
        clone.moveToLastChildOf(child_b);
        // Child c
        const child_c = p.insertAsLastChild();
        child_c.h = 'child c';
        // Clone 'node clone 1'
        clone = node_clone_1.clone();
        clone.moveToLastChildOf(child_c);
        // Clone 'child clone a'
        clone = child_clone_a.clone();
        clone.moveToLastChildOf(p);
        // Clone 'child b'
        clone = child_b.clone();
        clone.moveToLastChildOf(p);
    }

    //@+node:felix.20230529213901.1: *3* LeoUnitTest.dump_headlines
    /**
     * Dump root's headlines, or all headlines if root is None.
     */
    public dump_headlines(root?: Position, tag?: string): void {
        console.log('');
        if (tag) {
            console.log(tag);
        }
        const _iter = root ? root.self_and_subtree.bind(root) : this.c.all_positions.bind(this.c);
        for (const p of _iter()) {
            console.log('');
            console.log('level:', p.level(), p.h);
        }
    }
    //@+node:felix.20230224231417.1: *3* LeoUnitTest.dump_tree
    /**
     * Dump root's tree, or the entire tree if root is None.
     */
    public dump_tree(root?: Position, tag?: string): void {
        console.log('');
        if (tag) {
            console.log(tag);
        }
        const _iter = root ? root.self_and_subtree.bind(root) : this.c.all_positions.bind(this.c);
        for (const p of _iter()) {
            console.log('');
            console.log('level:', p.level(), p.h);
            g.printObj(g.splitLines(p.v.b));
        }
    }
    //@-others

}

//@-others
//@-leo
