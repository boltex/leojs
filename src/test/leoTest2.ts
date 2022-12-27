//@+leo-ver=5-thin
//@+node:felix.20220130224933.1: * @file src/test/leoTest2.ts

//@@language typescript
//@@tabwidth -4

/**
 * Support for LeoJS's new unit tests, contained in src/tests/.
 */

// import time
// import unittest
// import warnings
// from leo.core import leoGlobals as g
// from leo.core import leoApp

import * as g from '../core/leoGlobals';
import { LeoApp, LoadManager } from '../core/leoApp';
import { Commands } from "../core/leoCommands";
import { NodeIndices, VNode, Position } from '../core/leoNodes';
import { GlobalConfigManager } from '../core/leoConfig';
import { NullGui } from '../core/leoGui';
import * as assert from 'assert';
import { ISettings } from '../core/leoFind';

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

    // lm.computeStandardDirectories()

    const leoID = await g.app.setLeoID(false, true);

    if (!leoID) {
        throw Error("unable to set LeoID.");
    }

    g.app.nodeIndices = new NodeIndices(g.app.leoID);
    g.app.config = new GlobalConfigManager();

    // g.app.db = g.NullObject('g.app.db')
    // g.app.pluginsController = g.NullObject('g.app.pluginsController')
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
    public settings!: ISettings;

    //@+others
    //@+node:felix.20220130224933.4: *3* LeoUnitTest.setUp, tearDown & setUpClass

    constructor() { }

    public async setUpClass(): Promise<Commands> {
        return create_app('null');
    }

    /**
     * Create a commander using a **null** gui, regardless of g.app.gui.
     * Create the nodes in the commander.
     */
    public setUp(): void {
        // Set g.unitTesting *early*, for guards.
        (g.unitTesting as boolean) = true;

        // Create a new commander for each test.
        // This is fast, because setUpClass has done all the imports.
        const c = new Commands("", new NullGui());
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

    //@-others

}

//@-others
//@-leo
