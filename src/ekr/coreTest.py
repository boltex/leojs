# -*- coding: utf-8 -*-
#@+leo-ver=5-thin
#@+node:ekr.20210104121029.1: * @file src/ekr/coreTest.py
#@@first
"""
Support fuctions for unit testing for leojs. Based on leoTest2.py.
"""
import time

#@+others
#@+node:ekr.20210104121029.5: ** function: create_app
def create_app():
    """
    Create the Leo application, g.app, the Gui, g.app.gui, and a commander.
    
    This method is expensive (about 1 sec) only the first time it is called.
    
    Thereafter, recreating g.app, g.app.gui, and new commands is fast.
    """
    # dump_leo_modules()
    t1 = time.process_time()
    from leo.core import leoGlobals as g
    from leo.core import leoApp
    from leo.core import leoConfig
    from leo.core import leoNodes
    from leo.core import leoCommands
    from leo.core import leoGui
    t2 = time.process_time()
    g.app = leoApp.LeoApp()
    g.app.recentFilesManager = leoApp.RecentFilesManager()
    g.app.loadManager = leoApp.LoadManager()
    g.app.loadManager.computeStandardDirectories()
    if not g.app.setLeoID(useDialog=False, verbose=True):
        raise ValueError("unable to set LeoID.")
    g.app.nodeIndices = leoNodes.NodeIndices(g.app.leoID)
    g.app.config = leoConfig.GlobalConfigManager()
    g.app.db = g.TracingNullObject('g.app.db')
    g.app.pluginsController = g.NullObject('g.app.pluginsController')
    g.app.commander_cacher = g.NullObject('g.app.commander_cacher')
    g.app.gui=leoGui.NullGui()
    t3 = time.process_time()
    # Create a dummy commander, to do the imports in c.initObjects.
    c = leoCommands.Commands(fileName=None, gui=g.app.gui)
    # dump_leo_modules()
    t4 = time.process_time()
    if False and t4 - t3 > 0.1:
        print('create_app\n'
            f"  imports: {(t2-t1):.3f}\n"
            f"      gui: {(t3-t2):.3f}\n"
            f"commander: {(t4-t2):.3f}\n"
            f"    total: {(t4-t1):.3f}\n")
    return c
#@-others
#@-leo
