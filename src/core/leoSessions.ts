//@+leo-ver=5-thin
//@+node:felix.20231003002131.1: * @file src/core/leoSessions.ts
/**
 * Support for sessions in Leo.
 */
//@+others
//@+node:felix.20231003002311.1: ** class SessionManager
/**
 * A class managing session data and related commands.
 */
class SessionManager {

    //@+others
    //@+node:felix.20231003002311.2: *3* SessionManager.clear_session
    /**
     * Close all tabs except the presently selected tab.
     */
    public clear_session(c: Commands): void {
    // 
    for (const frame of g.app.windowList) {
        if (frame.c !== c) {
            frame.c.close();
        }
    }
    }
    //@+node:felix.20231003002311.3: *3* SessionManager.error
    // def error (self,s):
        // # Do not use g.trace or g.es here.
        // print(s)
    //@+node:felix.20231003002311.4: *3* SessionManager.get_session
    // def get_session(self) -> list[str]:
    //     """Return a list of UNLs for open tabs."""
    //     result: list[str] = []
    //     # Fix #1118, part 2.
    //     if not getattr(g.app.gui, 'frameFactory', None):
    //         return result
    //     mf = getattr(g.app.gui.frameFactory, 'masterFrame', None)
    //     if mf:
    //         outlines = [mf.widget(i).leo_c for i in range(mf.count())]
    //     else:
    //         outlines = [i.c for i in g.app.windowList]
    //     for c in outlines:
    //         result.append(c.p.get_full_gnx_UNL())
    //     return result


    /**
     * Return a list of UNLs for open tabs.
     */
    public get_session(): string[] {
        let result: string[] = [];
        if (!g.app.gui.frameFactory) {
          return result;
        }
        // TODO !
        console.log('TODO : TEST get_session');
        
        const mf = g.app.gui.frameFactory.masterFrame;
        const outlines = mf ? Array.from({ length: mf.count() }, (_, i) => mf.widget(i).leo_c) : g.app.windowList.map(i => i.c);
        for (const c of outlines) {
          result.push(c.p.get_full_gnx_UNL());
        }
        return result;
      }
    //@+node:felix.20231003002311.5: *3* SessionManager.get_session_path
    // def get_session_path(self) -> Optional[str]:
    //     """Return the path to the session file."""
    //     for path in (g.app.homeLeoDir, g.app.homeDir):
    //         if g.os_path_exists(path):
    //             return g.finalize_join(path, 'leo.session')
    //     return None

    /**
     * Return the path to the session file.
     */
    public async get_session_path(): Promise<string | undefined> {

        for (const p_path of [g.app.homeLeoDir, g.app.homeDir]) {
          if (await g.os_path_exists(p_path)) {
            return g.finalize_join(p_path, 'leo.session');
          }
        }
        return undefined;
      }
    //@+node:felix.20231003002311.6: *3* SessionManager.load_session
    // def load_session(self, c: Cmdr = None, unls: list[str] = None) -> None:
    //     """
    //     Open a tab for each item in UNLs & select the indicated node in each.

    //     unls is the list returned by SessionManager.load_snapshot()
    //     """
    //     if not unls:
    //         return
    //     unls = [z.strip() for z in unls or [] if z.strip()]
    //     for unl in unls:
    //         if not g.isValidUnl(unl):
    //             g.trace(f"Ignoring invalid session {'unl'}: {unl!r}")
    //             continue
    //         fn = g.getUNLFilePart(unl)
    //         exists = fn and g.os_path_exists(fn)
    //         if not exists:
    //             g.trace('File part does not exist', repr(fn))
    //             g.trace(f"Bad unl: {unl!r}")
    //             continue
    //         if 'startup' in g.app.debug:
    //             g.trace('loading session file:', fn)
    //         # This selects the proper position.
    //         g.app.loadManager.loadLocalFile(fn, gui=g.app.gui, old_c=c)


    /**
     * Open a tab for each item in UNLs & select the indicated node in each.
     *
     * unls is the list returned by SessionManager.load_snapshot()
     */
     public async load_session(c?: Commands, unls?: string[] ): Promise<void> {
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
          const exists = fn && g.os_path_exists(fn);
          if (!exists) {
            g.trace('File part does not exist', fn);
            g.trace(`Bad unl: ${unl}`);
            continue;
          }
          if (g.app.debug.includes('startup')) {
            g.trace('loading session file:', fn);
          }
          g.app.loadManager.loadLocalFile(fn, { gui: g.app.gui, old_c: c });
        }
      }
    //@+node:felix.20231003002311.7: *3* SessionManager.load_snapshot
    // def load_snapshot(self) -> str:
    //     """
    //     Load a snapshot of a session from the leo.session file.
    //     """
    //     try:
    //         session = g.app.db['session']
    //         if 'startup' in g.app.debug:
    //             g.printObj(session, tag='load_snapshot: session data')
    //         return session
    //     except KeyError:
    //         print('SessionManager.load_snapshot: no previous session')
    //     except Exception:
    //         g.trace('Unexpected exception in SessionManager.load_snapshot')
    //         g.es_exception()
    //     return None

    /**
     *  Load a snapshot of a session from the leo.session file.
     */
    public  load_snapshot(): string|undefined {
        try {
          const session: string = g.app.db['session'];
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
    // def save_snapshot(self) -> None:

    //     if g.app.batchMode or g.app.inBridge or g.unitTesting:
    //         return
    //     try:
    //         session = self.get_session()
    //         if 'shutdown' in g.app.debug:
    //             g.printObj(session, tag='save_snapshot: session data')
    //         if not session:
    //             return  # #2433: don't save an empty session.
    //         g.app.db['session'] = session
    //     except Exception:
    //         g.trace('Unexpected exception in SessionManager.save_snapshot')
    //         g.es_exception()


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
    @g.command('session-clear')
    def session_clear_command(event: Event) -> None:
        """Close all tabs except the presently selected tab."""
        c = event.get('c')
        m = g.app.sessionManager
        if c and m:
            m.clear_session(c)
    //@+node:felix.20231003002319.3: *3* session-create
    @g.command('session-create')
    def session_create_command(event: Event) -> None:
        """Create a new @session node."""
        c = event.get('c')
        m = g.app.sessionManager
        if c and m:
            aList = m.get_session()
            p2 = c.p.insertAfter()
            p2.b = "\n".join(aList)
            p2.h = "@session"
            c.redraw()
    //@+node:felix.20231003002319.4: *3* session-refresh
    @g.command('session-refresh')
    def session_refresh_command(event: Event) -> None:
        """Refresh the current @session node."""
        c = event.get('c')
        m = g.app.sessionManager
        if c and m:
            aList = m.get_session()
            c.p.b = "\n".join(aList)
            c.redraw()
    //@+node:felix.20231003002319.5: *3* session-restore
    @g.command('session-restore')
    def session_restore_command(event: Event) -> None:
        """Open a tab for each item in the @session node & select the indicated node in each."""
        c = event.get('c')
        m = g.app.sessionManager
        if c and m:
            if c.p.h.startswith('@session'):
                aList = c.p.b.split("\n")
                m.load_session(c, aList)
            else:
                print('Please select an "@session" node')
    //@+node:felix.20231003002319.6: *3* session-snapshot-load
    @g.command('session-snapshot-load')
    def session_snapshot_load_command(event: Event) -> None:
        """Load a snapshot of a session from the leo.session file."""
        c = event.get('c')
        m = g.app.sessionManager
        if c and m:
            aList = m.load_snapshot()
            m.load_session(c, aList)
    //@+node:felix.20231003002319.7: *3* session-snapshot-save
    @g.command('session-snapshot-save')
    def session_snapshot_save_command(event: Event) -> None:
        """Save a snapshot of the present session to the leo.session file."""
        m = g.app.sessionManager
        if m:
            m.save_snapshot()
    //@-others
}
//@-others
//@@language typescript
//@@tabwidth -4

import * as vscode from 'vscode';
import * as g from './leoGlobals';
import { command } from '../core/decorators';
import { Commands } from './leoCommands';
//@-leo
