//@+leo-ver=5-thin
//@+node:felix.20250308203620.1: * @file src/core/leoAppCommands.ts
//@+<< imports >>
//@+node:felix.20250308203703.1: ** << imports >>
import * as g from './leoGlobals';
import { command } from './decorators';
import { Commands } from './leoCommands';

//@-<< imports >>
//@+others
//@+node:felix.20250308203655.1: ** class TopLevelCommands
export class TopLevelCommands {
    //@+others
    //@+node:felix.20250308203655.2: *3* ctrl-click-at-cursor
    @command(
        'ctrl-click-at-cursor',
        'Simulate a control-click at the cursor.'
    )
    public async ctrlClickAtCursor(this: Commands): Promise<void> {
        const c = this; // event and event.get('c')
        if (c) {
            await g.openUrlOnClick(c);
        }
    }
    //@+node:felix.20250308203655.3: *3* demangle-recent-files
    @command(
        'demangle-recent-files',
        'Path demangling potentially alters the paths in the recent files list' +
        'according to find/replace patterns in the @data path-demangle setting.'
    )
    public async demangle_recent_files_command(this: Commands): Promise<void> {
        /*
        Path demangling potentially alters the paths in the recent files list
        according to find/replace patterns in the @data path-demangle setting.
        For example:

            REPLACE: .gnome-desktop
            WITH: My Desktop

        The default setting specifies no patterns.
        */
        const c = this; // event and event.get('c')
        if (c) {
            const data = c.config.getData('path-demangle');
            if (data) {
                await g.app.recentFilesManager.demangleRecentFiles(c, data);
            } else {
                g.es_print('No patterns in @data path-demangle');
            }
        }
    }
    //@+node:felix.20250308203655.4: *3* enable/disable/toggle-idle-time-events
    @command('disable-idle-time-events', 'Disable default idle-time event handling.')
    public disable_idle_time_events(this: Commands): void {
        g.app.idle_time_hooks_enabled = false;
    }
    @command('enable-idle-time-events', 'Enable default idle-time event handling.')
    public enable_idle_time_events(this: Commands): void {
        g.app.idle_time_hooks_enabled = true;
    }
    @command('toggle-idle-time-events', 'Toggle default idle-time event handling.')
    public toggle_idle_time_events(this: Commands): void {
        g.app.idle_time_hooks_enabled = !g.app.idle_time_hooks_enabled;
    }
    //@+node:felix.20250308203655.5: *3* open_mimetype
    @command('open-mimetype', 'Simulate double-clicking on the filename in a file manager.')
    public async openMimetype(this: Commands): Promise<void> {
        /*
        Order of preference is:
        1) @string mime_open_cmd setting
        2) _mime_open_cmd, defined per sys.platform detection
        3) open_func(fpath), defined per sys.platform detection
        */
        const c = this; // event and event.get('c')
        if (c) {
            await g.open_mimetype(c, c.p);
        }
    }
    //@+node:felix.20250308203655.6: *3* open-url
    @command('open-url', 'Open the url in the headline or body text of the selected node.')
    public async openUrl(this: Commands): Promise<void> {
        /*
        Open the url in the headline or body text of the selected node.

        Use the headline if it contains a valid url.
        Otherwise, look *only* at the first line of the body.
        */
        const c = this; // event and event.get('c')
        if (c) {
            await g.openUrl(c.p);
        }
    }
    //@+node:felix.20250308203655.7: *3* open-url-under-cursor
    @command('open-url-under-cursor', 'Open the url under the cursor.')
    public async openUrlUnderCursor(this: Commands): Promise<void> {
        const c = this; // event and event.get('c')
        if (c) {
            await g.openUrlOnClick(c);
        }
    }
    //@-others
}
//@-others
//@@language typescript
//@@tabwidth -4
//@@pagewidth 70
//@-leo
