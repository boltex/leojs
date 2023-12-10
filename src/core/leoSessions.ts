//@+leo-ver=5-thin
//@+node:felix.20231003002131.1: * @file src/core/leoSessions.ts
/**
 * Support for sessions in Leo.
 */
//@+<< leoSessions imports & annotations >>
//@+node:felix.20231003223423.1: ** << leoSessions imports & annotations >>
import * as vscode from 'vscode';
import * as g from './leoGlobals';
import { command } from '../core/decorators';
import { Commands } from './leoCommands';
//@-<< leoSessions imports & annotations >>
//@+others
//@+node:felix.20231003002311.1: ** class SessionManager
/**
 * A class managing session data and related commands.
 */
export class SessionManager {

  //@+others
  //@+node:felix.20231003002311.2: *3* SessionManager.clear_session
  /**
   * Close all tabs except the presently selected tab.
   */
  public async clear_session(c: Commands): Promise<void> {
    // 
    for (const frame of g.app.windowList) {
      if (frame.c !== c) {
        await frame.c.close();
      }
    }
  }

  //@+node:felix.20231003002311.3: *3* SessionManager.error
  // public error (s: string){
  // // Do not use g.trace or g.es here.
  // g.es_print(s);
  // }
  //@+node:felix.20231003002311.4: *3* SessionManager.get_session
  /**
   * Return a list of UNLs for open tabs.
   */
  public get_session(): string[] {
    let result: string[] = [];

    // if (!g.app.gui.frameFactory) {
    //   return result;
    // }
    // const mf = g.app.gui.frameFactory.masterFrame;
    // const outlines = mf ? Array.from({ length: mf.count() }, (_, i) => mf.widget(i).leo_c) : g.app.windowList.map(i => i.c);

    const outlines = g.app.windowList.map((p_frame) => {
      return p_frame.c;
    });

    for (const c of outlines) {
      if (c.fileName()) {
        result.push(c.p.get_full_gnx_UNL());
      } else {
      }
    }
    return result;
  }
  //@+node:felix.20231003002311.5: *3* SessionManager.get_session_path
  /**
   * Return the path to the session file.
   */
  public async get_session_path(): Promise<string | undefined> {

    for (const p_path of [g.app.homeLeoDir, g.app.homeDir]) {
      if (p_path && await g.os_path_exists(p_path)) {
        return g.finalize_join(p_path, 'leo.session');
      }
    }
    return undefined;
  }
  //@+node:felix.20231003002311.6: *3* SessionManager.load_session
  /**
   * Open a tab for each item in UNLs & select the indicated node in each.
   *
   * unls is the list returned by SessionManager.load_snapshot()
   */
  public async load_session(c?: Commands, unls?: string[]): Promise<void> {
    if (!unls) {
      return;
    }
    unls = unls.filter(z => z.trim()).map(z => z.trim());
    for (const unl of unls) {
      if (!g.isValidUnl(unl)) {
        g.trace(`Ignoring invalid session unl: ${unl}`);
        continue;
      }
      const fn = g.getUNLFilePart(unl);
      const exists = fn && await g.os_path_exists(fn);
      if (!exists) {
        g.trace('File part does not exist', fn);
        g.trace(`Bad unl: ${unl}`);
        continue;
      }
      if (g.app.debug.includes('startup')) {
        g.trace('loading session file:', fn);
      }
      await g.app.loadManager!.loadLocalFile(fn, g.app.gui, c, true);
    }
  }
  //@+node:felix.20231003002311.7: *3* SessionManager.load_snapshot
  /**
   * Load a snapshot of a session from the leo.session file.
   *
   * Return a list of unls.
   */
  public load_snapshot(): string[] | undefined {
    try {
      const session: string[] = g.app.db['session'];
      if (g.app.debug.includes('startup')) {
        g.printObj(session, 'load_snapshot: session data');
      }
      return session;
    } catch (e) {
      g.trace('Unexpected exception in SessionManager.load_snapshot');
      g.es_exception(e);
    }
    return undefined;
  }
  //@+node:felix.20231003002311.8: *3* SessionManager.save_snapshot
  /**
   * Save a snapshot of the present session to the leo.session file.
   *
   * Called automatically during shutdown.
   */
  public save_snapshot(): void {
    if (g.app.batchMode || g.app.inBridge || g.unitTesting) {
      return;
    }
    try {
      const session = this.get_session();
      if (g.app.debug.includes('shutdown')) {
        g.printObj(session, 'save_snapshot: session data');
      }
      if (!session) {
        return; // Don't save an empty session.
      }
      g.app.db['session'] = session;
    } catch (e) {
      g.trace('Unexpected exception in SessionManager.save_snapshot');
      g.es_exception();
    }
  }
  //@-others

}
//@+node:felix.20231003002319.1: ** class TopLevelSessionsCommands
export class TopLevelSessionsCommands {
  //@+others
  //@+node:felix.20231003002319.2: *3* session-clear
  @command(
    'session-clear',
    'Close all tabs except the presently selected tab.'
  )
  public async session_clear_command(this: Commands): Promise<void> {
    const c = this; // event and event.get('c')
    const m = g.app.sessionManager;
    if (c && m) {
      await m.clear_session(c);
    }
  }
  //@+node:felix.20231003002319.3: *3* session-create
  @command(
    'session-create',
    'Create a new @session node.'
  )
  public session_create_command(this: Commands): void {
    const c = this; // event and event.get('c')
    const m = g.app.sessionManager;
    if (c && m) {
      const aList = m.get_session();
      const p2 = c.p.insertAfter();
      p2.b = aList.join("\n");
      p2.h = "@session";
      c.redraw();
    }
  }
  //@+node:felix.20231003002319.4: *3* session-refresh
  @command(
    'session-refresh',
    'Refresh the current @session node.'
  )
  public session_refresh_command(this: Commands): void {
    const c = this; // event and event.get('c')
    const m = g.app.sessionManager;
    if (c && m) {
      const aList = m.get_session();
      c.p.b = aList.join("\n");
      c.redraw();
    }
  }
  //@+node:felix.20231003002319.5: *3* session-restore
  @command(
    'session-restore',
    'Open a tab for each item in the @session node & select the indicated node in each.'
  )
  public async session_restore_command(this: Commands): Promise<void> {
    const c = this; // event and event.get('c')
    const m = g.app.sessionManager;
    if (c && m) {
      if (c.p.h.startsWith('@session')) {
        const aList = c.p.b.split("\n");
        await m.load_session(c, aList);
      } else {
        g.es_print('Please select an "@session" node');
      }
    }
  }
  //@+node:felix.20231003002319.6: *3* session-snapshot-load
  @command(
    'session-snapshot-load',
    'Load a snapshot of a session from the leo.session file.'
  )
  public async session_snapshot_load_command(this: Commands): Promise<void> {
    const c = this; // event and event.get('c')
    const m = g.app.sessionManager;
    if (c && m) {
      const aList = m.load_snapshot();
      await m.load_session(c, aList);
    }
  }
  //@+node:felix.20231003002319.7: *3* session-snapshot-save
  @command(
    'session-snapshot-save',
    'Save a snapshot of the present session to the leo.session file.'
  )
  public session_snapshot_save_command(this: Commands): void {
    const m = g.app.sessionManager;
    if (m) {
      m.save_snapshot();
    }
  }
  //@-others
}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
