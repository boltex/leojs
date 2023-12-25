//@+leo-ver=5-thin
//@+node:felix.20211031230132.1: * @file src/core/leoConfig.ts
//@+<< imports >>
//@+node:felix.20211031230614.1: ** << imports >>
import { Commands } from './leoCommands';
import * as g from './leoGlobals';
import { Position, VNode } from './leoNodes';
import { build_rclick_tree } from './mod_scripting';

//@-<< imports >>
//@+<< class ParserBaseClass >>
//@+node:felix.20220529184714.1: ** << class ParserBaseClass >>
/**
 * The base class for settings parsers.
 */
export class ParserBaseClass {
    public c: Commands;
    public clipBoard: any[];
    // True if this is the .leo file being opened,
    // as opposed to myLeoSettings.leo or leoSettings.leo.
    public localFlag: boolean;

    public shortcutsDict: g.SettingsDict;

    public openWithList: { [key: string]: any }[]; // A list of dicts containing 'name','shortcut','command' keys.

    // Keys are canonicalized names.
    public dispatchDict: {
        [key: string]: (
            p: Position,
            kind: string,
            name: string,
            val: any
        ) => any;
    };
    public debug_count: number;

    //@+<< ParserBaseClass data >>
    //@+node:felix.20220529184714.2: *3* << ParserBaseClass data >>
    // These are the canonicalized names.
    // Case is ignored, as are '_' and '-' characters.
    static readonly basic_types = [
        // Headlines have the form @kind name = var
        'bool',
        'color',
        'directory',
        'int',
        'ints',
        'float',
        'path',
        'ratio',
        'string',
        'strings',
    ];

    static readonly control_types = [
        'buttons',
        'commands',
        'data',
        'enabledplugins',
        'font',
        'ifenv',
        'ifhostname',
        'ifplatform',
        'ignore',
        'menus',
        'mode',
        'menuat',
        'openwith',
        'outlinedata',
        'popup',
        'settings',
        'shortcuts',
    ];

    // Keys are settings names, values are (type,value) tuples.
    public settingsDict: g.SettingsDict | undefined;

    //@-<< ParserBaseClass data >>
    //@+others
    //@+node:felix.20220529184714.3: *3*  pbc.ctor

    /**
     * Ctor for the ParserBaseClass class.
     */
    constructor(c: Commands, localFlag: boolean) {
        this.c = c;
        this.clipBoard = [];
        // True if this is the .leo file being opened,
        // as opposed to myLeoSettings.leo or leoSettings.leo.
        this.localFlag = localFlag;
        this.shortcutsDict = new g.SettingsDict('parser.shortcutsDict');
        this.openWithList = []; // A list of dicts containing 'name','shortcut','command' keys.
        // Keys are canonicalized names.
        this.dispatchDict = {
            bool: this.doBool,
            buttons: this.doButtons, // New in 4.4.4
            color: this.doColor,
            commands: this.doCommands, // New in 4.4.8.
            data: this.doData, // New in 4.4.6
            directory: this.doDirectory,
            enabledplugins: this.doEnabledPlugins,
            font: this.doFont,
            ifenv: this.doIfEnv, // New in 5.2 b1.
            ifhostname: this.doIfHostname,
            ifplatform: this.doIfPlatform,
            ignore: this.doIgnore,
            int: this.doInt,
            ints: this.doInts,
            float: this.doFloat,
            menus: this.doMenus, // New in 4.4.4
            menuat: this.doMenuat,
            popup: this.doPopup, // New in 4.4.8
            mode: this.doMode, // New in 4.4b1.
            openwith: this.doOpenWith, // New in 4.4.3 b1.
            outlinedata: this.doOutlineData, // New in 4.11.1.
            path: this.doPath,
            ratio: this.doRatio,
            shortcuts: this.doShortcuts,
            string: this.doString,
            strings: this.doStrings,
        };
        this.debug_count = 0;
    }

    //@+node:felix.20220529184714.4: *3* pbc.computeModeName
    public computeModeName(name: string): string {
        let s = name.trim().toLowerCase();
        const j = s.indexOf(' ');

        if (j > -1) {
            s = s.substring(0, j);
        }

        if (s.endsWith('mode')) {
            s = s.substring(0, s.length - 4).trim();
        }

        if (s.endsWith('-')) {
            s = s.substring(0, s.length - 1);
        }

        const i = s.indexOf('::');

        if (i > -1) {
            // The actual mode name is everything up to the "::"
            // The prompt is everything after the prompt.
            s = s.substring(0, i);
        }

        const modeName = s + '-mode';

        return modeName;
    }
    //@+node:felix.20220529184714.5: *3* pbc.createModeCommand
    /**
     * Create a mode command.
     */
    public createModeCommand(
        modeName: string,
        name: string,
        modeDict: any
    ): void {
        // The prompt is everything after the '::'
        modeName = 'enter-' + modeName.replace(' ', '-');
        const i = name.indexOf('::');
        if (i > -1) {
            const prompt = name.slice(i + 2).trim();
            modeDict['*command-prompt*'] = { kind: prompt };  // BindingInfo
        }
        // Save the info for k.finishCreate and k.makeAllBindings.
        const d = g.app.config.modeCommandsDict;
        // New in 4.4.1 b2: silently allow redefinitions of modes.
        d.set(modeName, modeDict);
    }
    //@+node:felix.20220529184714.6: *3* pbc.error
    public error(s: string): void {
        g.pr(s);
        // Does not work at present because we are using a null Gui.
        g.blue(s);
    }

    //@+node:felix.20220529184714.7: *3* pbc.kind handlers
    //@+node:felix.20220529184714.8: *4* pbc.doBool
    public doBool(p: Position, kind: string, name: string, val: any): void {
        if (['True', 'true', '1'].includes(val)) {
            this.set(p, kind, name, true);
        } else if (['False', 'false', '0'].includes(val)) {
            this.set(p, kind, name, false);
        } else {
            this.valueError(p, kind, name, val);
        }
    }

    //@+node:felix.20220529184714.9: *4* pbc.doButtons
    /**
     * Create buttons for each @button node in an @buttons tree.
     */
    public async doButtons(p: Position, kind: string, name: string, val: any): Promise<void> {
        const c: Commands = this.c;
        const tag = '@button';
        const aList: any[] = [];
        const seen: VNode[] = [];
        const after = p.nodeAfterTree();

        while (p && p.__bool__() && !p.__eq__(after)) {
            if (seen.includes(p.v)) {
                p.moveToNodeAfterTree();
            } else if (p.isAtIgnoreNode()) {
                seen.push(p.v);
                p.moveToNodeAfterTree();
            } else {
                seen.push(p.v);
                if (g.match_word(p.h, 0, tag)) {
                    // We can not assume that p will be valid when it is used.
                    const script = await g.getScript(
                        c,
                        p,
                        false,
                        true,
                        true
                    );
                    // #2011: put rclicks in aList. Do not inject into command_p.
                    const command_p = p.copy();
                    const rclicks = build_rclick_tree(command_p, undefined, true);
                    aList.push([command_p, script, rclicks]);
                }
                p.moveToThreadNext();
            }
        }

        // This setting is handled differently from most other settings,
        // because the last setting must be retrieved before any commander exists.
        if (aList.length) {
            // Bug fix: 2011/11/24: Extend the list, don't replace it.
            g.app.config.atCommonButtonsList.push(...aList);
            g.app.config.buttonsFileName = c ? c.shortFileName() : '<no settings file>';
        }
    }
    //@+node:felix.20220529184714.10: *4* pbc.doColor
    public doColor(p: Position, kind: string, name: string, val: any): void {
        // At present no checking is done.

        val = val.replace(/^\"+|\"+$/g, '');
        val = val.replace(/^\'+|\'+$/g, '');
        this.set(p, kind, name, val);
    }
    //@+node:felix.20220529184714.11: *4* pbc.doCommands
    /**
     * Handle an @commands tree.
     */
    public async doCommands(
        p: Position,
        kind: string,
        name: string,
        val: any
    ): Promise<void> {
        const c = this.c;
        const aList: [Position, string][] = [];
        const tag = '@command';
        const seen: VNode[] = [];
        const after: Position = p.nodeAfterTree();

        while (p && p.__bool__() && !p.__eq__(after)) {
            if (seen.includes(p.v)) {
                p.moveToNodeAfterTree();
            } else if (p.isAtIgnoreNode()) {
                seen.push(p.v);
                p.moveToNodeAfterTree();
            } else {
                seen.push(p.v);
                if (g.match_word(p.h, 0, tag)) {
                    // We can not assume that p will be valid when it is used.
                    const script = await g.getScript(c, p, false, true, true);
                    aList.push([p.copy(), script]);
                }
                p.moveToThreadNext();
            }
        }
        // This setting is handled differently from most other settings,
        // because the last setting must be retrieved before any commander exists.
        if (aList.length) {
            // Bug fix: 2011/11/24: Extend the list, don't replace it.
            g.app.config.atCommonCommandsList.push(...aList);
        }
    }

    //@+node:felix.20220529184714.12: *4* pbc.doData
    public doData(p: Position, kind: string, name: string, val: any): void {
        // New in Leo 4.11: do not strip lines.
        // New in Leo 4.12.1: strip *nothing* here.
        // New in Leo 4.12.1: allow composition of nodes:
        // - Append all text in descendants in outline order.
        // - Ensure all fragments end with a newline.
        const data: string[] = g.splitLines(p.b);

        for (let p2 of p.subtree()) {
            if (p2.b && !p2.h.startsWith('@')) {
                data.push(...g.splitLines(p2.b));
                if (!p2.b.endsWith('\n')) {
                    data.push('\n');
                }
            }
        }
        this.set(p, kind, name, data);
    }

    //@+node:felix.20220529184714.13: *4* pbc.doOutlineData & helper
    public doOutlineData(
        p: Position,
        kind: string,
        name: string,
        val: any
    ): string {
        // New in Leo 4.11: do not strip lines.
        const data = this.getOutlineDataHelper(p);
        this.set(p, kind, name, data);
        return 'skip';
    }
    //@+node:felix.20220529184714.14: *5* pbc.getOutlineDataHelper
    public getOutlineDataHelper(p: Position): string | undefined {
        const c = this.c;
        if (!p || !p.__bool__()) {
            return undefined;
        }
        let s: string | undefined;
        try {
            // Copy the entire tree to s.
            c.fileCommands.leo_file_encoding = 'utf-8';
            s = c.fileCommands.outline_to_clipboard_string(p);
            s = g.toUnicode(s!, 'utf-8');
        } catch (exception) {
            g.es_exception(exception);
            s = undefined;
        }
        return s;
    }
    //@+node:felix.20220529184714.15: *4* pbc.doDirectory & doPath
    public doDirectory(
        p: Position,
        kind: string,
        name: string,
        val: any
    ): void {
        // At present no checking is done.
        this.set(p, kind, name, val);
    }

    // Same as doDirectory for backward compatibility
    public doPath(p: Position, kind: string, name: string, val: any): void {
        // At present no checking is done.
        this.set(p, kind, name, val);
    }

    //@+node:felix.20220529184714.16: *4* pbc.doEnabledPlugins
    public doEnabledPlugins(
        p: Position,
        kind: string,
        name: string,
        val: any
    ): void {
        const c = this.c;
        let s = p.b;
        // This setting is handled differently from all other settings,
        // because the last setting must be retrieved before any commander exists.
        // 2011/09/04: Remove comments, comment lines and blank lines.
        const aList: string[] = [];
        const lines: string[] = g.splitLines(s);

        for (let s of lines) {
            let i = s.indexOf('#');
            if (i > -1) {
                s = s.substring(0, i) + '\n'; // 2011/09/29: must add newline back in.
            }
            if (s.trim()) {
                aList.push(s.trimStart());
            }
        }
        s = aList.join('');
        // Set the global config ivars.
        g.app.config.enabledPluginsString = s;
        g.app.config.enabledPluginsFileName = c
            ? c.shortFileName()
            : '<no settings file>';
    }

    //@+node:felix.20220529184714.17: *4* pbc.doFloat
    public doFloat(p: Position, kind: string, name: string, val: any): void {
        try {
            val = Number(val);
            this.set(p, kind, name, val);
        } catch (valError) {
            this.valueError(p, kind, name, val);
        }
    }

    //@+node:felix.20220529184714.18: *4* pbc.doFont
    /**
     * Handle an @font node. Such nodes affect syntax coloring *only*.
     */
    public doFont(p: Position, kind: string, name: string, val: any): void {
        const d = this.parseFont(p);
        // Set individual settings.
        for (let key of ['family', 'size', 'slant', 'weight']) {
            const data = d[key];
            if (data) {
                let name;
                let w_val;
                [name, w_val] = data;
                const setKind = key;
                this.set(p, setKind, name, w_val);
            }
        }
    }

    //@+node:felix.20220529184714.19: *4* pbc.doIfEnv
    /**
     * Support @ifenv in @settings trees.
     *
     * Enable descendant settings if the value of os.getenv is in any of the names.
     */
    public doIfEnv(
        p: Position,
        kind: string,
        name: string,
        val: any
    ): string | undefined {
        const aList = name.split(',');
        if (!aList.length) {
            return 'skip';
        }
        name = aList[0]; // first should be name

        let env: string | undefined;
        if (process && process.env && process.env[name]) {
            env = process.env[name];
        }

        env = env ? env.toLowerCase().trim() : 'none';

        aList.shift(); // remove first
        for (let s of aList) {
            if (s.toLowerCase().trim() === env) {
                return undefined;
            }
        }
        return 'skip';
    }

    //@+node:felix.20220529184714.20: *4* pbc.doIfHostname
    /**
     * Support @ifhostname in @settings trees.
     *
     * Examples: Let h = os.environ('HOSTNAME')
     *
     * @ifhostname bob
     *  Enable descendant settings if h == 'bob'

     * @ifhostname !harry
     * Enable descendant settings if h != 'harry'
     */
    public doIfHostname(
        p: Position,
        kind: string,
        name: string,
        val: any
    ): string | undefined {

        const lm = g.app.loadManager!;
        const h = lm.computeMachineName().trim();
        const s = name.trim();
        if (s.startsWith('!')) {
            if (h === s.slice(1)) {
                return 'skip';
            }
        } else if (h !== s) {
            return 'skip';
        }
        return undefined;
    }

    //@+node:felix.20220529184714.21: *4* pbc.doIfPlatform
    /**
     * Support @ifplatform in @settings trees.
     */
    public doIfPlatform(
        p: Position,
        kind: string,
        name: string,
        val: any
    ): string | undefined {
        const platform = process.platform.toLowerCase();
        for (const s of name.split(',')) {
            if (platform && platform === s.toLowerCase()) {
                return undefined;
            }
        }
        return 'skip';
    }

    //@+node:felix.20220529184714.22: *4* pbc.doIgnore
    public doIgnore(p: Position, kind: string, name: string, val: any): string {
        return 'skip';
    }

    //@+node:felix.20220529184714.23: *4* pbc.doInt
    public doInt(p: Position, kind: string, name: string, val: any): void {
        try {
            val = Number(val);
            val = Math.trunc(val);
            this.set(p, kind, name, val);
        } catch (valError) {
            this.valueError(p, kind, name, val);
        }
    }

    //@+node:felix.20220529184714.24: *4* pbc.doInts
    /**
     * We expect either:
     * @ints [val1,val2,...]aName=val
     *@ints aName[val1,val2,...]=val
     */
    public doInts(p: Position, kind: string, name: string, val: any): void {
        name = name.trim(); // The name indicates the valid values.
        let i = name.indexOf('[');
        let j = name.indexOf(']');

        if (-1 < i && i < j) {
            const items_s = name.substring(i + 1, j);
            let items: string[] | number[] = items_s.split(',');
            name = name.substring(0, i) + name.substring(j + 1).trim();

            try {
                // items = [int(item.trim()) for item in items]  // type:ignore
                items = items.map((item) => {
                    return Number(item.trim());
                });
            } catch (valueError) {
                items = [];
                this.valueError(p, 'ints[]', name, val);
                return;
            }

            // kind = `ints[${','.join([str(item) for item in items])}]`;
            kind = `ints[${items
                .map((item) => {
                    return item.toString();
                })
                .join(',')}]`;

            try {
                val = Number(val);
                val = Math.trunc(val);
            } catch (valueError) {
                this.valueError(p, 'int', name, val);
                return;
            }

            if (!items.includes(val)) {
                this.error(`${val} is not in ${kind} in ${name}`);
                return;
            }

            // At present no checking is done.
            this.set(p, kind, name, val);
        }
    }

    //@+node:felix.20220529184714.25: *4* pbc.doMenuat
    /**
     * Handle @menuat setting.
     */
    public doMenuat(p: Position, kind: string, name: string, val: any): void {
        // TODO ?
        /* 
        if g.app.config.menusList:
            // get the patch fragment
            patch: List[Any] = []
            if p.hasChildren():
                // self.doMenus(p.copy().firstChild(),kind,name,val,storeIn=patch)
                self.doItems(p.copy(), patch)
            // setup
            parts = name.split()
            if len(parts) != 3:
                parts.append('subtree')
            targetPath, mode, source = parts
            if not targetPath.startswith('/'):
                targetPath = '/' + targetPath
            ans = self.patchMenuTree(g.app.config.menusList, targetPath)
            if ans:
                // pylint: disable=unpacking-non-sequence
                list_, idx = ans
                if mode not in ('copy', 'cut'):
                    if source != 'clipboard':
                        use = patch  // [0][1]
                    else:
                        if isinstance(self.clipBoard, list):
                            use = self.clipBoard
                        else:
                            use = [self.clipBoard]
                if mode == 'replace':
                    list_[idx] = use.pop(0)
                    while use:
                        idx += 1
                        list_.insert(idx, use.pop(0))
                elif mode == 'before':
                    while use:
                        list_.insert(idx, use.pop())
                elif mode == 'after':
                    while use:
                        list_.insert(idx + 1, use.pop())
                elif mode == 'cut':
                    self.clipBoard = list_[idx]
                    del list_[idx]
                elif mode == 'copy':
                    self.clipBoard = list_[idx]
                else:  // append
                    list_.extend(use)
            else:
                g.es_print("ERROR: didn't find menu path " + targetPath)
        elif g.app.inBridge:
            pass  // #48: Not an error.
        else:
            g.es_print("ERROR: @menuat found but no menu tree to patch")

        */
    }

    //@+node:felix.20220529184714.26: *5* pbc.getName
    public getName(val: string, val2?: string): string {
        if (val2 && val2.trim()) {
            val = val2;
        }
        val = val.split('\n', 1)[0]; // keep first

        // for i in "*.-& \t\n":
        //     val = val.replace(i, '')

        const str = '*.-& \t\n';
        for (var i = 0; i < str.length; i++) {
            val = val.split(str[i]).join('');
        }

        return val.toLowerCase();
    }

    //@+node:felix.20220529184714.27: *5* pbc.dumpMenuTree
    public dumpMenuTree(aList: any[], level = 0, path = ''): void {
        // Todo ?
        /*
        for z in aList:
            kind, val, val2 = z
            pad = '    ' * level
            if kind == '@item':
                name = self.getName(val, val2)
                g.es_print(f"{pad} {val} ({val2}) [{path + '/' + name}]")
            else:
                name = self.getName(kind.replace('@menu ', ''))
                g.es_print(f"{pad} {kind}... [{path + '/' + name}]")
                self.dumpMenuTree(val, level + 1, path=path + '/' + name)
        */
    }

    //@+node:felix.20220529184714.28: *5* pbc.patchMenuTree
    public patchMenuTree(orig: any[], targetPath: string, path = ''): any {
        // TODO ?
        /* 
        kind: str
        val: Any
        val2: Any
        for n, z in enumerate(orig):
            kind, val, val2 = z
            if kind == '@item':
                name = self.getName(val, val2)
                curPath = path + '/' + name
                if curPath == targetPath:
                    return orig, n
            else:
                name = self.getName(kind.replace('@menu ', ''))
                curPath = path + '/' + name
                if curPath == targetPath:
                    return orig, n
                ans = self.patchMenuTree(val, targetPath, path=path + '/' + name)
                if ans:
                    return ans

        */
        return undefined;
    }
    //@+node:felix.20220529184714.29: *4* pbc.doMenus & helper
    public doMenus(p: Position, kind: string, name: string, val: any): void {
        // TODO ?
        /* 
        
        c = self.c
        p = p.copy()
        aList: List[Any] = []  # This entire logic is mysterious, and likely buggy.
        after = p.nodeAfterTree()
        while p and p != after:
            self.debug_count += 1
            h = p.h
            if g.match_word(h, 0, '@menu'):
                name = h[len('@menu') :].strip()
                if name:
                    for z in aList:
                        name2, junk, junk = z
                        if name2 == name:
                            self.error(f"Replacing previous @menu {name}")
                            break
                    aList2: List[Any] = []  # Huh?
                    kind = f"{'@menu'} {name}"
                    self.doItems(p, aList2)
                    aList.append((kind, aList2, None),)
                    p.moveToNodeAfterTree()
                else:
                    p.moveToThreadNext()
            else:
                p.moveToThreadNext()
        if self.localFlag:
            self.set(p, kind='menus', name='menus', val=aList)
        else:
            g.app.config.menusList = aList
            name = c.shortFileName() if c else '<no settings file>'
            g.app.config.menusFileName = name

        */
    }

    //@+node:felix.20220529184714.30: *5* pbc.doItems
    public doItems(p: Position, aList: any[]): void {
        // TODO
        /* 
        p = p.copy()
        after = p.nodeAfterTree()
        p.moveToThreadNext()
        while p and p != after:
            self.debug_count += 1
            h = p.h
            for tag in ('@menu', '@item', '@ifplatform'):
                if g.match_word(h, 0, tag):
                    itemName = h[len(tag) :].strip()
                    if itemName:
                        lines = [z for z in g.splitLines(p.b) if
                            z.strip() and not z.strip().startswith('#')]
                        # Only the first body line is significant.
                        # This allows following comment lines.
                        body = lines[0].strip() if lines else ''
                        if tag == '@menu':
                            aList2: List[Any] = []  # Huh?
                            kind = f"{tag} {itemName}"
                            self.doItems(p, aList2)  # Huh?
                            aList.append((kind, aList2, body),)  # #848: Body was None.
                            p.moveToNodeAfterTree()
                            break
                        else:
                            kind = tag
                            head = itemName
                            # We must not clean non-unicode characters!
                            aList.append((kind, head, body),)
                            p.moveToThreadNext()
                            break
            else:
                p.moveToThreadNext()
         */
    }

    //@+node:felix.20220529184714.31: *4* pbc.doMode
    /**
     * Parse an @mode node and create the enter-<name>-mode command.
     */
    public doMode(p: Position, kind: string, name: string, val: any): void {
        const c = this.c;
        const name1 = name;
        const modeName = this.computeModeName(name);
        const d = new g.SettingsDict(`modeDict for ${modeName}`);
        const s = p.b;
        const lines = g.splitLines(s);
        for (let line in lines) {
            line = line.trim();
            if (line && !g.match(line, 0, '#')) {
                let name;
                let bi;
                [name, bi] = this.parseShortcutLine('*mode-setting*', line);
                if (!name) {
                    // An entry command: put it in the special *entry-commands* key.
                    d.add_to_list('*entry-commands*', bi);
                } else if (bi) {
                    // A regular shortcut.
                    bi.pane = modeName;
                    const aList: any[] = d.get(name) || [];
                    // Important: use previous bindings if possible.
                    let key2;
                    let aList2;
                    [key2, aList2] = c.config.getShortcut(name);

                    // aList3 = [z for z in aList2 if z.pane != modeName];
                    const aList3 = aList2.filter((z) => {
                        return z.pane !== modeName;
                    });

                    if (aList3.length) {
                        aList.push(...aList3);
                    }
                    aList.push(bi);
                    // d[name] = aList;
                    d.set(name, aList);
                }
            }
            // Restore the global shortcutsDict.
            // Create the command, but not any bindings to it.
            this.createModeCommand(modeName, name1, d);
        }
    }

    //@+node:felix.20220529184714.32: *4* pbc.doOpenWith
    public doOpenWith(p: Position, kind: string, name: string, val: any): void {
        const d = this.parseOpenWith(p);
        d['name'] = name;
        d['shortcut'] = val;
        name = 'openwithtable';
        kind = name;

        this.openWithList.push(d);
        this.set(p, kind, name, this.openWithList);
    }

    //@+node:felix.20220529184714.33: *4* pbc.doPopup & helper
    /**
     * Handle @popup menu items in @settings trees.
     */
    public doPopup(p: Position, kind: string, name: string, val: any): void {
        const popupName = name;
        // popupType = val
        const aList: any[] = [];

        p = p.copy();
        this.doPopupItems(p, aList);
        if (!g.app.config.context_menus) {
            g.app.config.context_menus = {};
        }
        g.app.config.context_menus[popupName] = aList;
    }

    //@+node:felix.20220529184714.34: *5* pbc.doPopupItems
    public doPopupItems(p: Position, aList: any[]): void {
        p = p.copy();
        const after = p.nodeAfterTree();
        p.moveToThreadNext();
        let h: string;
        let kind: string;
        let body: string;
        let head: string;
        while (p && p.__bool__() && !p.__eq__(after)) {
            h = p.h;
            let hadBreak = false;
            for (let tag of ['@menu', '@item']) {
                if (g.match_word(h, 0, tag)) {
                    const itemName = h.substring(tag.length).trim();
                    if (itemName) {
                        if (tag === '@menu') {
                            const aList2: any[] = [];
                            kind = `${itemName}`;
                            body = p.b;
                            this.doPopupItems(p, aList2); // Huh?
                            aList.push([kind + '\n' + body, aList2]);
                            p.moveToNodeAfterTree();
                            hadBreak = true;
                            break;
                        } else {
                            kind = tag;
                            head = itemName;
                            body = p.b;
                            aList.push([head, body]);
                            p.moveToThreadNext();
                            hadBreak = true;
                            break;
                        }
                    }
                }
                if (!hadBreak) {
                    p.moveToThreadNext();
                }
            }
        }
    }

    //@+node:felix.20220529184714.35: *4* pbc.doRatio
    public doRatio(p: Position, kind: string, name: string, val: any): void {
        try {
            val = Number(val);
            if (0.0 <= val && val <= 1.0) {
                this.set(p, kind, name, val);
            } else {
                this.valueError(p, kind, name, val);
            }
        } catch (valError) {
            this.valueError(p, kind, name, val);
        }
    }

    //@+node:felix.20220529184714.36: *4* pbc.doShortcuts
    /**
     * Handle an @shortcut or @shortcuts node.
     */
    public doShortcuts(
        p: Position,
        kind: string,
        junk_name: string,
        junk_val: any,
        s?: string
    ): void {
        const c = this.c;
        const d = this.shortcutsDict;

        if (s === undefined) {
            s = p.b;
        }
        const fn = d.name();
        for (let line of g.splitLines(s)) {
            line = line.trim();
            if (line && !g.match(line, 0, '#')) {
                let commandName;
                let bi;
                [commandName, bi] = this.parseShortcutLine(fn, line);
                if (bi === undefined) {
                    // Fix #718.
                    console.log(`\nWarning: bad shortcut specifier: ${line}\n`);
                } else {
                    if (
                        bi &&
                        ![undefined, 'none', 'None'].includes(bi.stroke)
                    ) {
                        this.doOneShortcut(bi, commandName!, p);
                    }
                    // New in Leo 5.7: Add local assignments to None to c.k.killedBindings.
                    else if (c.config.isLocalSettingsFile()) {
                        if (c.k.killedBindings) {
                            c.k.killedBindings.append(commandName);
                        }
                    }
                }
            }
        }
    }

    //@+node:felix.20220529184714.37: *5* pbc.doOneShortcut
    /**
     * Handle a regular shortcut.
     */
    public doOneShortcut(bi: any, commandName: string, p: Position): void {
        const d = this.shortcutsDict;
        const aList: any[] = d.get(commandName) || [];
        aList.push(bi);
        d.set(commandName, aList);
    }

    //@+node:felix.20220529184714.38: *4* pbc.doString
    public doString(p: Position, kind: string, name: string, val: any): void {
        // At present no checking is done.
        this.set(p, kind, name, val);
    }

    //@+node:felix.20220529184714.39: *4* pbc.doStrings
    /**
     * We expect one of the following:
     * @strings aName[val1,val2...]=val
     * @strings [val1,val2,...]aName=val
     */
    public doStrings(p: Position, kind: string, name: string, val: any): void {
        name = name.trim();
        let i = name.indexOf('[');
        let j = name.indexOf(']');
        if (-1 < i && i < j) {
            const items_s = name.substring(i + 1, j);
            let items = items_s.split(',');
            items = items.map((p_item) => {
                return p_item.trim();
            });
            name = name.substring(0, i) + name.substring(j + 1).trim();
            kind = `strings[${items.join(',')}]`;
            // At present no checking is done.
            this.set(p, kind, name, val);
        }
    }

    //@+node:felix.20220529184714.40: *3* pbc.munge
    public munge(s: string): string {
        return g.app.config.canonicalizeSettingName(s)!;
    }
    //@+node:felix.20220529184714.41: *3* pbc.oops
    public oops(): void {
        g.pr(
            'ParserBaseClass oops:',
            g.callers(),
            'must be overridden in subclass'
        );
    }

    //@+node:felix.20220529184714.42: *3* pbc.parsers
    //@+node:felix.20220529184714.43: *4* pbc.parseFont & helper
    public parseFont(p: Position): { [key: string]: any } {
        //  -> Dict[str, Any]:
        const d: { [key: string]: any } = {
            comments: [],
            family: undefined,
            size: undefined,
            slant: undefined,
            weight: undefined,
        };

        const s = p.b;
        const lines = g.splitLines(s);
        for (let line of lines) {
            this.parseFontLine(line, d);
        }
        const comments = d['comments'];
        d['comments'] = comments.join('\n');
        return d;
    }

    //@+node:felix.20220529184714.44: *5* pbc.parseFontLine
    public parseFontLine(line: string, d: { [key: string]: any }): void {
        let s = line.trim();

        if (!s) {
            return;
        }

        try {
            s = s.toString();
        } catch (unicodeError) {
            // pass
        }

        let comments;
        if (g.match(s, 0, '#')) {
            s = s.substring(1).trim();
            comments = d['comments'];
            comments.push(s);
            d['comments'] = comments;
            return;
        }

        // name is everything up to '='
        let i = s.indexOf('=');

        let name;
        let val;
        if (i === -1) {
            name = s;
            val = undefined;
        } else {
            name = s.substring(0, i).trim();
            val = s.substring(i + 1).trim();
            // trim single and double quotes
            val = val.replace(/^\"+|\"+$/g, '');
            val = val.replace(/^\'+|\'+$/g, '');
        }

        for (let tag of ['_family', '_size', '_slant', '_weight']) {
            if (name.endsWith(tag)) {
                const kind = tag.substring(1);
                d[kind] = [name, val]; // Used only by doFont.
                return;
            }
        }
    }

    //@+node:felix.20220529184714.45: *4* pbc.parseHeadline
    /**
     * Parse a headline of the form @kind:name=val
     * Return (kind,name,val).
     * Leo 4.11.1: Ignore everything after @data name.
     */
    public parseHeadline(
        s: string
    ): [string | undefined, string | undefined, any] {
        let kind;
        let name;
        let val;
        let i;
        let j;

        if (g.match(s, 0, '@')) {
            i = g.skip_id(s, 1, '-');
            i = g.skip_ws(s, i);
            kind = s.substring(1, i).trim();
            if (kind) {
                // name is everything up to '='
                if (kind === 'data') {
                    // i = g.skip_ws(s,i)
                    j = s.indexOf(' ', i);
                    if (j === -1) {
                        name = s.substring(i).trim();
                    } else {
                        name = s.substring(i, j).trim();
                    }
                } else {
                    j = s.indexOf('=', i);
                    if (j === -1) {
                        name = s.substring(i).trim();
                    } else {
                        name = s.substring(i, j).trim();
                        // val is everything after the '='
                        val = s.substring(j + 1).trim();
                    }
                }
            }
        }

        return [kind, name, val];
    }
    //@+node:felix.20220529184714.46: *4* pbc.parseOpenWith & helper
    public parseOpenWith(p: Position): { [key: string]: any } {
        const d = { command: undefined }; // d contains args, kind, etc tags.
        for (let line of g.splitLines(p.b)) {
            this.parseOpenWithLine(line, d);
        }
        return d;
    }

    //@+node:felix.20220529184714.47: *5* pbc.parseOpenWithLine
    public parseOpenWithLine(line: string, d: { [key: string]: any }): void {
        const s = line.trim();
        if (!s) {
            return;
        }
        let i = g.skip_ws(s, 0);
        if (g.match(s, i, '#')) {
            return;
        }
        let j = g.skip_c_id(s, i);
        const tag = s.substring(i, j).trim();
        if (!tag) {
            g.es_print(`@openwith lines must start with a tag: ${s}`);
            return;
        }

        i = g.skip_ws(s, j);
        if (!g.match(s, i, ':')) {
            g.es_print(`colon must follow @openwith tag: ${s}`);
            return;
        }
        i += 1;

        const val = s.substring(i).trim() || ''; // An empty val is valid.
        if (tag === 'arg') {
            const aList: any[] = d['args'] || [];
            aList.push(val);
            d['args'] = aList;
        } else if (d[tag]) {
            g.es_print(`ignoring duplicate definition of ${tag} ${s}`);
        } else {
            d[tag] = val;
        }
    }

    //@+node:felix.20220529184714.48: *4* pbc.parseShortcutLine
    /**
     * Parse a shortcut line.  Valid forms:
     *
     *  --> entry-command
     *  settingName = shortcut
     *  settingName ! paneName = shortcut
     *  command-name --> mode-name = binding
     *  command-name --> same = binding
     */
    public parseShortcutLine(
        kind: string,
        s: string
    ): [string | undefined, any] {
        s = s.replace(/[\x7F]/g, ''); // Can happen on MacOS. Very weird.
        let name;
        let val;
        let nextMode;

        nextMode = 'none';
        let i = g.skip_ws(s, 0);
        let j;
        let entryCommandName;

        if (g.match(s, i, '-->')) {
            // New in 4.4.1 b1: allow mode-entry commands.
            j = g.skip_ws(s, i + 3);
            i = g.skip_id(s, j, '-');
            entryCommandName = s.substring(j, i);

            // TODO : ? support key binding / keyStroke ?
            console.log(
                'TODO support key binding / keyStroke : ',
                entryCommandName
            );

            //  return [undefined, new g.BindingInfo('*entry-command*', commandName=entryCommandName)]
            return [undefined, undefined];
        }
        j = i;
        i = g.skip_id(s, j, '-@'); // #718.
        name = s.substring(j, i);
        // #718: Allow @button- and @command- prefixes.
        for (let tag of ['@button-', '@command-']) {
            if (name.startsWith(tag)) {
                name = name.substring(tag.length);
                break;
            }
        }
        if (!name) {
            return [undefined, undefined];
        }
        // New in Leo 4.4b2.
        i = g.skip_ws(s, i);
        if (g.match(s, i, '->')) {
            // New in 4.4: allow pane-specific shortcuts.
            j = g.skip_ws(s, i + 2);
            i = g.skip_id(s, j);
            nextMode = s.substring(j, i);
        }
        i = g.skip_ws(s, i);
        let pane;
        if (g.match(s, i, '!')) {
            // New in 4.4: allow pane-specific shortcuts.
            j = g.skip_ws(s, i + 1);
            i = g.skip_id(s, j);
            pane = s.substring(j, i);
            if (!pane.trim()) {
                pane = 'all';
            }
        } else {
            pane = 'all';
        }

        i = g.skip_ws(s, i);

        if (g.match(s, i, '=')) {
            i = g.skip_ws(s, i + 1);
            val = s.substring(i);
        }
        // New in 4.4: Allow comments after the shortcut.
        // Comments must be preceded by whitespace.
        if (val) {
            i = val.indexOf('#');
            if (i > 0 && [' ', '\t'].includes(val[i - 1])) {
                val = val.substring(0, i).trim();
            }
        }
        if (!val) {
            return [name, undefined];
        }

        // TODO : ? support key binding / keyStroke ?
        console.log('TODO support key binding / keyStroke : ', kind, s);

        return [undefined, undefined];
        // stroke = g.KeyStroke(binding=val) if val else undefined;
        // bi = g.BindingInfo(kind=kind, nextMode=nextMode, pane=pane, stroke=stroke);
        // return [name, bi];
    }

    //@+node:felix.20220529184714.49: *3* pbc.set
    /**
     * Init the setting for name to val.
     */
    public set(p: Position, kind: string, name: string, val: any): void {
        const c = this.c;
        // Note: when kind is 'shortcut', name is a command name.
        const key = this.munge(name);
        let parent;

        if (!key) {
            g.es_print('Empty setting name in', ` ${p.h} in ${c.fileName()}`);
            parent = p.parent();
            while (parent && parent.__bool__()) {
                g.trace('parent', parent.h);
                parent.moveToParent();
            }
            return;
        }

        const d = this.settingsDict!;
        const gs = d.get(key);

        if (gs) {
            g.assert(gs instanceof g.GeneralSetting, gs);
            const w_path = gs.path;
            if (g.finalize(c.mFileName) !== g.finalize(w_path)) {
                g.es('over-riding setting:', name, 'from', w_path); // 1341
            }
        }
        // Important: we can't use c here: it may be destroyed!

        d.set(
            key,
            new g.GeneralSetting({
                kind: kind, // type:ignore
                path: c.mFileName,
                tag: 'setting',
                unl: p && p.__bool__() ? p.get_UNL() : '',
                val: val,
            })
        );
    }

    //@+node:felix.20220529184714.50: *3* pbc.traverse
    /**
     * Traverse the entire settings tree.
     */
    public async traverse(): Promise<[g.SettingsDict, g.SettingsDict]> {
        const c = this.c;

        this.settingsDict = new g.SettingsDict( // type:ignore
            `settingsDict for ${c.shortFileName()}`
        );

        this.shortcutsDict = new g.SettingsDict( // was TypedDictOfLists.
            `shortcutsDict for ${c.shortFileName()}`
        );

        // This must be called after the outline has been inited.
        const p = c.config.settingsRoot();

        if (!p || !p.__bool__()) {
            // c.rootPosition() doesn't exist yet.
            // This is not an error.
            return [this.shortcutsDict, this.settingsDict];
        }

        const after: Position = p.nodeAfterTree();
        while (p && p.__bool__() && !p.__eq__(after)) {
            const result = await this.visitNode(p);
            if (result === 'skip') {
                // g.warning('skipping settings in',p.h)
                p.moveToNodeAfterTree();
            } else {
                p.moveToThreadNext();
            }
        }
        // Return the raw dict, unmerged.
        return [this.shortcutsDict, this.settingsDict];
    }

    //@+node:felix.20220529184714.51: *3* pbc.valueError
    /**
     * Give an error: val is not valid for kind.
     */
    public valueError(p: Position, kind: string, name: string, val: any): void {
        this.error(`${val} is not a valid ${kind} for ${name}`);
    }

    //@+node:felix.20220529184714.52: *3* pbc.visitNode (must be overwritten in subclasses)
    public async visitNode(p: Position): Promise<string | undefined> {
        await Promise.resolve();
        this.oops();
        return '';
    }

    //@-others
}

//@-<< class ParserBaseClass >>
//@+others
//@+node:felix.20231220235423.1: ** class ActiveSettingsOutline
export class ActiveSettingsOutline {

    public c: Commands;
    public commander!: Commands;
    public commanders!: [string, Commands][]
    public local_c: undefined | Commands;
    public parents!: Position[];
    public level!: number;
    public ready: Promise<void>;

    constructor(c: Commands) {

        this.c = c;
        this.ready = this.start().then(() => {
            this.create_outline();
        });

    }

    //@+others
    //@+node:felix.20231220235423.2: *3* aso.start & helpers
    /** 
     * Do everything except populating the new outline.
     */
    public async start(): Promise<void> {

        // Copy settings.
        const c = this.c;
        const settings = c.config.settingsDict;
        const shortcuts = c.config.shortcutsDict;
        // g.assert( isinstance(settings, SettingsDict), settings.toString() );
        // g.assert( isinstance(shortcuts, SettingsDict), shortcuts.toString() );
        const settings_copy = settings.copy();
        const shortcuts_copy = shortcuts.copy();
        // Create the new commander.
        this.commander = await this.new_commander();
        // Open hidden commanders for non-local settings files.
        await this.load_hidden_commanders();
        // Create the ordered list of commander tuples, including the local .leo file.
        this.create_commanders_list();
        // Jam the old settings into the new commander.
        this.commander.config.settingsDict = settings_copy;
        this.commander.config.shortcutsDict = shortcuts_copy;
    }

    //@+node:felix.20231220235423.3: *4* aso.create_commanders_list
    /**
     * Create the commanders list. Order matters.
     */
    public create_commanders_list(): void {


        const lm = g.app.loadManager!;

        // The first element of each tuple must match the return values of c.config.getSource.
        // "local_file", "theme_file", "myLeoSettings", "leoSettings"

        this.commanders = [
            ['leoSettings', lm.leo_settings_c!],
            ['myLeoSettings', lm.my_settings_c!],
        ];

        if (lm.theme_c) {
            this.commanders.push(['theme_file', lm.theme_c]);
        }

        if (this.c.config.settingsRoot()) {
            this.commanders.push(['local_file', this.c]);
        }

    }
    //@+node:felix.20231220235423.4: *4* aso.load_hidden_commanders
    /**
     * Open hidden commanders for leoSettings.leo, myLeoSettings.leo and theme.leo.
     */
    public async load_hidden_commanders(): Promise<void> {

        const lm = g.app.loadManager!;
        await lm.readGlobalSettingsFiles();
        // Make sure to reload the local file.
        const c = g.app.commanders()[0];
        const fn = c.fileName();
        if (fn) {
            this.local_c = await lm.openSettingsFile(fn);
        }
    }
    //@+node:felix.20231220235423.5: *4* aso.new_commander
    /**
     * Create the new commander, and load all settings files.
     */
    public async new_commander(): Promise<Commands> {

        const lm = g.app.loadManager!;
        const old_c = this.c;

        // Save any changes so they can be seen.
        if (old_c.isChanged()) {
            await old_c.save();
        }
        old_c.outerUpdate();

        // Suppress redraws until later.
        g.app.disable_redraw = true;
        // g.app.setLog(null);
        // g.app.lockLog();

        // Switch to the new commander. Do *not* use previous settings.
        const fileName = `${old_c.fileName()}-active-settings`;
        g.es(fileName);
        const c = g.app.newCommander(fileName);

        // NOT NEEDED IN LEOJS
        // Restore the layout, if we have ever saved this file.
        // if (!old_c) {
        //     c.frame.setInitialWindowGeometry();
        // }
        // // #1340: Don't do this. It is no longer needed.
        // // g.app.restoreWindowState(c)

        // c.frame.resizePanesToRatio(c.frame.ratio, c.frame.secondary_ratio);
        c.clearChanged();  // Clears all dirty bits.

        // Finish.
        lm.finishOpen(c);
        return c;

    }
    //@+node:felix.20231220235423.6: *3* aso.create_outline & helper
    /**
     * Create the summary outline
     */
    public create_outline(): void {

        const c = this.commander;
        //
        // Create the root node, with the legend in the body text.
        const root = c.rootPosition()!;
        root.h = `Legend for ${this.c.shortFileName()}`;
        root.b = this.legend();
        root.v.clearDirty();
        //
        // Create all the inner settings outlines.
        for (const [kind, commander] of this.commanders) {
            const p = root.insertAfter();
            p.h = g.shortFileName(commander.fileName());
            p.b = '@language rest\n@wrap\n';
            this.create_inner_outline(commander, kind, p);
        }
        //
        // Clean all dirty/changed bits, so closing this outline won't prompt for a save.
        for (const v of c.all_nodes()) {
            v.clearDirty();
        }
        for (const p of c.all_positions()) {
            p.clearDirty();
        }
        c.rootPosition()!.clearDirty();
        // c.setChanged();
        c.redraw();
        g.app.gui.fullRefresh();
    }
    //@+node:felix.20231220235423.7: *4* aso.legend
    /**
     * Compute legend for self.c
     */
    public legend(): string {

        const lm = g.app.loadManager!;
        let legend = `\
            @language rest

            legend:

                leoSettings.leo
             @  @button, @command, @mode
            [D] default settings
            [F] local file: {c.shortFileName()}
            [M] myLeoSettings.leo
            `;

        if (lm.theme_path) {
            legend = legend + `[T] theme file: ${g.shortFileName(lm.theme_path)}\n`;
        }

        return g.dedent(legend);

    }

    //@+node:felix.20231220235423.8: *3* aso.create_inner_outline
    /**
     * Create the outline for the given hidden commander, as descendants of root.
     */
    public create_inner_outline(c: Commands, kind: string, root: Position): void {

        // Find the settings tree
        const settings_root = c.config.settingsRoot();

        if (!settings_root) {
            // This should not be called if the local file has no @settings node.
            g.trace('no @settings node!!', c.shortFileName());
            return;
        }
        // Unify all settings.
        this.create_unified_settings(kind, root, settings_root);
        this.clean(root);

    }
    //@+node:felix.20231220235423.9: *3* aso.create_unified_settings
    /**
     * Create the active settings tree under root.
     */
    public create_unified_settings(kind: string, root: Position, settings_root: Position): void {

        const c = this.commander;
        const lm = g.app.loadManager!;
        const settings_pat = /^(@[\w-]+)(\s+[\w\-\.]+)?/;
        const valid_list = [
            '@bool', '@color', '@directory', '@encoding',
            '@int', '@float', '@ratio', '@string',
        ];
        const d = this.filter_settings(kind);
        let ignore: Position | undefined;
        let outline_data: Position | undefined;
        this.parents = [root];
        this.level = settings_root.level();
        for (const p of settings_root.subtree()) {
            //@+<< continue if we should ignore p >>
            //@+node:felix.20231220235423.10: *4* << continue if we should ignore p >>
            if (ignore) {
                if (p.__eq__(ignore)) {
                    ignore = undefined;
                } else {
                    // g.trace('IGNORE', p.h)
                    continue;
                }
            }
            if (outline_data) {
                if (p.__eq__(outline_data)) {
                    outline_data = undefined;
                } else {
                    this.add(p);
                    continue;
                }
            }
            //@-<< continue if we should ignore p >>
            const m = settings_pat.exec(p.h);
            if (!m) {
                this.add(p, 'ORG:' + p.h);
                continue;
            }
            if (m[2] && valid_list.includes(m[1])) {
                //@+<< handle a real setting >>
                //@+node:felix.20231220235423.11: *4* << handle a real setting >>
                const key = g.app.config.munge(m[2].trim())!;
                let val = d[key];
                if (val instanceof g.GeneralSetting) {
                    this.add(p);
                } else {
                    // Look at all the settings to discover where the setting is defined.
                    val = c.config.settingsDict.get(key);
                    if (val instanceof g.GeneralSetting) {
                        // Use this.c, not this.commander.
                        const letter = lm.computeBindingLetter(this.c, val.path);
                        p.h = `[${letter}] INACTIVE: ${p.h}`;
                        p.h = `UNUSED: ${p.h}`;
                    }
                    this.add(p);
                }
                //@-<< handle a real setting >>
                continue;
            }
            // Not a setting. Handle special cases.
            if (m[1] === '@ignore') {
                ignore = p.nodeAfterTree();
            }
            else if (['@data', '@outline-data'].includes(m[1])) {
                outline_data = p.nodeAfterTree();
                this.add(p);
            } else {
                this.add(p);
            }
        }
    }
    //@+node:felix.20231220235423.12: *3* aso.add
    /**
     * Add a node for p.
     *
     * We must *never* alter p in any way.
     * Instead, the org flag tells whether the "ORG:" prefix.
     */
    public add(p: Position, h?: string): void {

        let pad;

        if (0) {
            pad = ' '.repeat(p.level());
            console.log(pad, p.h);
        }
        const p_level = p.level();

        if (p_level > this.level + 1) {
            g.trace('OOPS', p.v.context.shortFileName(), this.level, p_level, p.h);
            return;
        }
        while (p_level < this.level + 1 && this.parents.length > 1) {
            this.parents.pop();
            this.level -= 1;
        }
        const parent = this.parents[this.parents.length - 1];
        const child = parent.insertAsLastChild();
        child.h = h || p.h;
        child.b = p.b;
        this.parents!.push(child);
        this.level! += 1;

    }
    //@+node:felix.20231220235423.13: *3* aso.clean
    /**
     * Remove all unnecessary nodes.
     * Remove the "ORG:" prefix from remaining nodes.
     */
    public clean(root: Position): void {
        this.clean_node(root);
    }

    /**
     * Remove p if it contains no children after cleaning its children.
     */
    public clean_node(p: Position): void {

        const tag = 'ORG:';
        // There are no clones, so deleting children in reverse preserves positions.
        for (const child of [...p.children()].reverse()) {
            this.clean_node(child);
        }
        if (p.h.startsWith(tag)) {
            if (p.hasChildren()) {
                p.h = p.h.replace(tag, '').trim();
            } else {
                p.doDelete();
            }
        }
    }
    //@+node:felix.20231220235423.14: *3* aso.filter_settings
    /**
     * Return a dict containing only settings defined in the file given by kind.
     */
    public filter_settings(target_kind: string): Record<string, unknown> {

        // Crucial: Always use the newly-created commander.
        //          It's settings are guaranteed to be correct.
        const c = this.commander;
        const valid_kinds = ['local_file', 'theme_file', 'myLeoSettings', 'leoSettings'];
        g.assert(valid_kinds.includes(target_kind), target_kind.toString());
        const d = c.config.settingsDict;
        const result: Record<string, any> = {};
        for (const key of d.keys()) {
            const gs = d.get(key);
            g.assert(gs instanceof g.GeneralSetting, gs.toString());
            if (!gs.kind) {
                g.trace('OOPS: no kind', gs.toString());
                continue;
            }
            const kind = c.config.getSource(gs);

            if (kind === 'ignore') {
                g.trace('IGNORE:', kind, key);
                continue;
            }
            if (kind === 'error') { // 2021/09/18.
                g.trace('ERROR:', kind, key);
                continue;
            }
            if (kind === target_kind) {
                result[key] = gs;
            }

        }

        return result;

    }
    //@-others

}
//@+node:felix.20220206213914.1: ** class GlobalConfigManager
/**
 * A class to manage configuration settings.
 */
export class GlobalConfigManager {
    public atCommonButtonsList: any[];
    public atCommonCommandsList: any[];
    public atLocalButtonsList: any[];
    public atLocalCommandsList: any[];
    public buttonsFileName: string;
    public configsExist: boolean;

    public context_menus: { [key: string]: any[] } | undefined;

    public defaultFont: string | undefined;
    public defaultFontFamily: string | undefined;
    public enabledPluginsFileName: string | undefined;
    public enabledPluginsString: string;
    public menusList: string[];
    public menusFileName: string;
    public modeCommandsDict: g.SettingsDict;
    public panes: any;
    public sc: any;
    public tree: any;

    public dictList!: g.SettingsDict[];
    public recentFiles: string[];

    public relative_path_base_directory!: string;

    public at_root_bodies_start_in_doc_mode!: boolean; // = true;
    public default_derived_file_encoding!: string; // = 'utf-8';
    public output_newline!: string; // = 'nl';
    public redirect_execute_script_output_to_log_pane!: boolean; // = true;

    //@+others
    //@+node:felix.20220207005211.2: *3* gcm.ctor
    constructor() {
        // List of info (command_p, script, rclicks) for common @buttons nodes.
        // where rclicks is a namedtuple('RClick', 'position,children')
        this.atCommonButtonsList = []; // List of info for common @buttons nodes.
        this.atCommonCommandsList = []; // List of info for common @commands nodes.
        this.atLocalButtonsList = []; // List of positions of @button nodes.
        this.atLocalCommandsList = []; // List of positions of @command nodes.
        this.buttonsFileName = '';
        this.configsExist = false; // True when we successfully open a setting file.
        this.default_derived_file_encoding = 'utf-8';
        this.enabledPluginsFileName = undefined;
        this.enabledPluginsString = '';
        this.menusList = [];
        this.menusFileName = '';
        this.modeCommandsDict = new g.SettingsDict('modeCommandsDict'); // was TypedDictOfLists.
        this.panes = undefined;
        this.recentFiles = [];
        this.sc = undefined;
        this.tree = undefined;
    }

    //@+node:felix.20220206213914.36: *3* gcm.config_iter

    /**
     * Letters:
     *   leoSettings.leo
     *   D default settings
     *   F loaded .leo File
     *   M myLeoSettings.leo
     *   @ @button, @command, @mode.
     *
     * @param c
     */
    public *config_iter(
        c: Commands
    ): Generator<[string, any, Commands, string]> {
        const lm = g.app.loadManager!;
        const d = c ? c.config.settingsDict : lm.globalSettingsDict;

        let limit = c.config.getInt('print-settings-at-data-limit');
        if (limit === undefined) {
            limit = 20; // A resonable default.
        }
        // pylint: disable=len-as-condition
        for (let key of [...d.keys()].sort()) {
            // return Object.keys(this.d);
            const gs = d.get(key);
            // assert isinstance(gs, g.GeneralSetting), repr(gs);
            if (gs && gs.kind) {
                const letter: string = lm.computeBindingLetter(c, gs.path!);
                let val: string[] | string = gs.val;
                if (gs.kind === 'data') {
                    // #748: Remove comments
                    const aList = (val as string[])
                        .filter((z) => {
                            return z.trim() && !z.trim().startsWith('#');
                        })
                        .map((z) => {
                            return '        ' + z.trimRight();
                        });
                    // [' ' * 8 + z.rstrip() for z in val if z.strip() && !z.strip().startsWith('#')] ;

                    if (!aList.length) {
                        val = '[]';
                    } else if (limit === 0 || aList.length < limit) {
                        val = '\n    [\n' + aList.join('\n') + '\n    ]';
                        // The following doesn't work well.
                        // val = g.objToString(aList, indent=' '*4)
                    } else {
                        val = `<${aList.length} non-comment lines>`;
                    }
                } else if (
                    (typeof val === 'string' || val instanceof String) &&
                    val.startsWith('<?xml')
                ) {
                    val = '<xml>';
                }
                let key2 = `@${gs.kind} ${key}`;
                yield [key2, val, c, letter];
            }
        }
    }
    /* 

    lm = g.app.loadManager
    d = c.config.settingsDict if c else lm.globalSettingsDict
    limit = c.config.getInt('print-settings-at-data-limit')
    if limit is None:
        limit = 20  # A reasonable default.
    # pylint: disable=len-as-condition
    for key in sorted(list(d.keys())):
        gs = d.get(key)
        assert isinstance(gs, g.GeneralSetting), repr(gs)
        if gs and gs.kind:
            letter = lm.computeBindingLetter(c, gs.path)
            val = gs.val
            if gs.kind == 'data':
                # #748: Remove comments
                aList = [' ' * 8 + z.rstrip() for z in val
                    if z.strip() and not z.strip().startswith('#')]
                if not aList:
                    val = '[]'
                elif limit == 0 or len(aList) < limit:
                    val = '\n    [\n' + '\n'.join(aList) + '\n    ]'
                    # The following doesn't work well.
                    # val = g.objToString(aList, indent=' '*4)
                else:
                    val = f"<{len(aList)} non-comment lines>"
            elif isinstance(val, str) and val.startswith('<?xml'):
                val = '<xml>'
            key2 = f"@{gs.kind:>6} {key}"
            yield key2, val, c, letter

    */
    //@+node:felix.20220207005224.2: *3* gcm.canonicalizeSettingName (munge)
    public canonicalizeSettingName(name?: string): string | undefined {
        if (name === undefined) {
            return undefined;
        }
        name = name.toLowerCase();

        ['-', '_', ' ', '\n'].forEach((ch) => {
            name = name!.split(ch).join('');
        });

        return name ? name : undefined;
    }

    // munge = canonicalizeSettingName

    //@+node:felix.20220207005224.1: *3* gcm.Getters...
    //@+node:felix.20220207005224.3: *4* gcm.exists
    /**
     * Return true if a setting of the given kind exists, even if it is None.
     */
    public exists(setting: string, kind: string): boolean {
        const lm = g.app.loadManager;
        const d = lm!.globalSettingsDict;
        if (d) {
            let junk: any;
            let found: boolean;
            [junk, found] = this.getValFromDict(d, setting, kind);
            return found;
        }
        return false;
    }

    //@+node:felix.20220207005224.4: *4* gcm.get & allies
    /**
     * Get the setting and make sure its type matches the expected type.
     */
    public get(setting: string, kind: string): any {
        // It *is* valid to call this method: it returns the global settings.
        const lm = g.app.loadManager!;
        const d = lm.globalSettingsDict;
        if (d) {
            g.assert(d instanceof g.SettingsDict, d.toString());
            let val: any;
            let junk: boolean;
            [val, junk] = this.getValFromDict(d, setting, kind);
            return val;
        }
        return undefined;
    }

    //@+node:felix.20220207005224.5: *5* gcm.getValFromDict
    /**
     * Look up the setting in d. If warn is True, warn if the requested type
     * does not (loosely) match the actual type.
     * returns (val,exists)
     */
    public getValFromDict(
        d: g.SettingsDict,
        setting: string,
        requestedType: string,
        warn: boolean = true
    ): [any, boolean] {
        let tag = 'gcm.getValFromDict';
        const gs = d.get(this.munge(setting)!);
        if (!gs) {
            return [undefined, false];
        }

        g.assert(gs instanceof g.GeneralSetting, gs.toString());

        const val = gs.val;
        const isNone = ['Undefined', 'None', 'none', ''].includes(val);
        if (!this.typesMatch(gs.kind, requestedType)) {
            // New in 4.4: make sure the types match.
            // A serious warning: one setting may have destroyed another!
            // Important: this is not a complete test of conflicting settings:
            // The warning is given only if the code tries to access the setting.
            if (warn) {
                g.error(
                    `${tag}: ignoring '${setting}' setting.\n` +
                    `${tag}: '@${gs.kind}' is not '@${requestedType}'.\n` +
                    `${tag}: there may be conflicting settings!`
                );
            }
            return [undefined, false];
        }

        if (isNone) {
            return ['', true];
        }

        // 2011/10/24: Exists, a *user-defined* empty value.
        return [val, true];
    }

    //@+node:felix.20220207005224.6: *5* gcm.typesMatch
    /**
     * Return True if type1, the actual type, matches type2, the requeseted type.
     *
     * The following equivalences are allowed:
     *
     * - None matches anything.
     * - An actual type of string or strings matches anything *except* shortcuts.
     * - Shortcut matches shortcuts.
     */
    public typesMatch(type1: string, type2: string): boolean {
        // The shortcuts logic no longer uses the get/set code.
        const shortcuts = ['shortcut', 'shortcuts'];
        if (shortcuts.includes(type1) || shortcuts.includes(type2)) {
            g.trace('oops: type in shortcuts');
        }
        return (
            type1 === undefined ||
            type2 === undefined ||
            (type1.startsWith('string') && !shortcuts.includes(type2)) ||
            (type1 === 'language' && type2 === 'string') ||
            (type1 === 'int' && type2 === 'size') ||
            (shortcuts.includes(type1) && shortcuts.includes(type2)) ||
            type1 === type2
        );
    }

    //@+node:felix.20220207005224.7: *4* gcm.getAbbrevDict
    /**
     * Search all dictionaries for the setting & check it's type
     */
    public getAbbrevDict(): { [key: string]: string } {
        const d = this.get('abbrev', 'abbrev');
        return d || {};
    }

    //@+node:felix.20220207005224.8: *4* gcm.getBool
    /**
     * Return the value of @bool setting, or the default if the setting is not found.
     * @param setting
     * @param defaultVal
     * @returns the boolean setting's value, or default
     */
    public getBool(setting: string, defaultVal: any): any {
        const val = this.get(setting, 'bool');
        if ([true, false].includes(val)) {
            return val;
        }
        return defaultVal;
    }
    //@+node:felix.20220207005224.9: *4* gcm.getButtons
    /**
     * Return a list of tuples (x,y) for common @button nodes.
     */
    public getButtons(): [any, any][] {
        return g.app.config.atCommonButtonsList;
    }
    //@+node:felix.20220207005224.10: *4* gcm.getColor
    /**
     * Return the value of @color setting.
     */
    public getColor(setting: string): string {
        let col = this.get(setting, "color");
        while (col && col.startsWith('@')) {
            col = this.get(col.substring(1), "color");
        }
        return col;
    }
    //@+node:felix.20220207005224.11: *4* gcm.getCommonCommands
    /**
     * Return the list of tuples (headline,script) for common @command nodes.
     */
    public getCommonAtCommands(): Array<[string, string]> {
        return g.app.config.atCommonCommandsList;
    }
    //@+node:felix.20220207005224.12: *4* gcm.getData & getOutlineData
    /**
     * Return a list of non-comment strings in the body text of @data setting.
     */
    public getData(
        setting: string,
        strip_comments = true,
        strip_data = true
    ): string[] {
        let data: string[] = this.get(setting, 'data') || [];
        // New in Leo 4.12.1: add two keyword arguments, with legacy defaults.
        if (data && data.length && strip_comments) {
            data = data.filter((z) => {
                !z.trim().startsWith('#');
            });
        }
        if (data && data.length && strip_data) {
            data = data
                .map((z) => {
                    return z.trim();
                })
                .filter((z) => {
                    return !!z;
                });
        }
        return data;
    }

    /**
     * Return the pastable (xml text) of the entire @outline-data tree.
     * @param setting
     * @returns
     */
    public getOutlineData(setting: string): string[] {
        return this.get(setting, 'outlinedata');
    }

    //@+node:felix.20220207005224.13: *4* gcm.getDirectory
    /**
     * Return the value of @directory setting, or null if the directory does not exist.
     */
    public async getDirectory(setting: string): Promise<string | undefined> {
        const theDir = this.get(setting, 'directory');
        if (await g.os_path_exists(theDir) && await g.os_path_isdir(theDir)) {
            return theDir;
        }
        return undefined;
    }
    //@+node:felix.20220207005224.14: *4* gcm.getEnabledPlugins
    // * LEOJS : UNUSED FOR NOW
    /* def getEnabledPlugins(self):
        """Return the body text of the @enabled-plugins node."""
        return g.app.config.enabledPluginsString
     */
    //@+node:felix.20220207005224.15: *4* gcm.getFloat
    /**
     * Return the value of @float setting.
     */
    public getFloat(setting: string): number | undefined {
        let val = this.get(setting, "float");
        try {
            val = parseFloat(val);
            return val;
        } catch (e) {
            return undefined;
        }
    }
    //@+node:felix.20220207005224.16: *4* gcm.getFontFromParams
    // * LEOJS : UNUSED FOR NOW
    /* def getFontFromParams(self, family, size, slant, weight, defaultSize=12):
        """Compute a font from font parameters.

        Arguments are the names of settings to be use.
        Default to size=12, slant="roman", weight="normal".

        Return None if there is no family setting so we can use system default fonts."""
        family = self.get(family, "family")
        if family in (None, ""):
            family = self.defaultFontFamily
        size = self.get(size, "size")
        if size in (None, 0):
            size = defaultSize
        slant = self.get(slant, "slant")
        if slant in (None, ""):
            slant = "roman"
        weight = self.get(weight, "weight")
        if weight in (None, ""):
            weight = "normal"
        return g.app.gui.getFontFromParams(family, size, slant, weight)
     */
    //@+node:felix.20220207005224.17: *4* gcm.getInt
    /**
     * Return the value of @int setting.
     */
    public getInt(setting: string): number | undefined {
        let val = this.get(setting, "int");
        try {
            val = parseInt(val, 10);
            return val;
        } catch (e) {
            return undefined;
        }
    }
    //@+node:felix.20220207005224.18: *4* gcm.getLanguage
    /**
     * Return the setting whose value should be a language known to Leo.
     */
    public getLanguage(setting: string): string {
        const language = this.getString(setting);
        return language;
    }
    //@+node:felix.20220207005224.19: *4* gcm.getMenusList
    /**
     * Return the list of entries for the @menus tree.
     */
    public getMenusList(): any[] {
        const aList = this.get('menus', 'menus');
        // aList is typically empty.
        return aList || g.app.config.menusList;
    }
    //@+node:felix.20220207005224.20: *4* gcm.getOpenWith
    /**
     * Return a list of dictionaries corresponding to @openwith nodes.
     */
    public getOpenWith(): Record<string, any>[] {
        const val = this.get('openwithtable', 'openwithtable');
        return val;
    }
    //@+node:felix.20220207005224.21: *4* gcm.getRatio
    /**
     * Return the value of @float setting, or None if there is an error.
     */
    public getRatio(setting: string): number | undefined {
        let val = this.get(setting, "ratio");
        try {
            val = parseFloat(val);
            if (val >= 0.0 && val <= 1.0) {
                return val;
            }
        } catch (e) {
            // pass
        }
        return undefined;
    }
    //@+node:felix.20220207005224.22: *4* gcm.getRecentFiles
    /**
     * Return the list of recently opened files.
     */
    public getRecentFiles(): string[] {
        return this.recentFiles;
    }
    //@+node:felix.20220207005224.23: *4* gcm.getString
    /**
     * Return the value of @string setting.
     */
    public getString(setting: string): string {
        return this.get(setting, 'string');
    }
    //@+node:felix.20220206213914.37: *3* gcm.valueInMyLeoSettings
    /**
     * Return the value of the setting, if any, in myLeoSettings.leo.
     */
    public valueInMyLeoSettings(settingName: string): any {

        const lm = g.app.loadManager!;
        const d = lm.globalSettingsDict;
        const mungedSettingName = this.munge(settingName);
        if (mungedSettingName) {

            const gs = d.get(mungedSettingName); // A GeneralSetting object.
            if (gs) {
                const w_path = gs.path;
                if (w_path.indexOf('myLeoSettings.leo') > -1) {
                    return gs.val;
                }
            }
        }
        return undefined;
    }
    //@-others
}

// Aliases for GlobalConfigManager members
export interface GlobalConfigManager {
    munge: (name?: string) => string | undefined;
}

GlobalConfigManager.prototype.munge =
    GlobalConfigManager.prototype.canonicalizeSettingName;
//@+node:felix.20220214191554.1: ** class LocalConfigManager
/**
 * A class to hold config settings for commanders.
 */
export class LocalConfigManager {
    public c: Commands;
    public settingsDict: g.SettingsDict;
    public shortcutsDict: g.SettingsDict;

    public defaultBodyFontSize: number;
    public defaultLogFontSize: number;
    public defaultMenuFontSize: number;
    public defaultTreeFontSize: number;

    public default_derived_file_encoding!: BufferEncoding;
    public default_at_auto_file_encoding!: BufferEncoding;
    public new_leo_file_encoding!: string;
    public save_clears_undo_buffer!: boolean;

    public use_plugins!: boolean;
    public create_nonexistent_directories!: boolean;

    public defaultFont: string | undefined;
    public defaultFontFamily: string | undefined;
    public enabledPluginsFileName: string | undefined;
    public enabledPluginsString: string | undefined;

    public panes: any;
    public sc: any;
    public tree: any;

    public dictList!: { [key: string]: any }[];
    public recentFiles!: string[];

    public relative_path_base_directory!: string;

    public at_root_bodies_start_in_doc_mode!: boolean; // = true;
    public output_newline!: string; // = 'nl';
    public redirect_execute_script_output_to_log_pane!: boolean; // = true;

    //@+others
    //@+node:felix.20220214191554.3: *3* c.config.ctor
    constructor(c: Commands, previousSettings?: LocalConfigManager) {
        this.c = c;

        const lm = g.app.loadManager!;
        if (previousSettings) {
            this.settingsDict = previousSettings.settingsDict;
            this.shortcutsDict = previousSettings.shortcutsDict;
            g.assert(
                this.settingsDict instanceof g.SettingsDict,
                JSON.stringify(this.settingsDict, null, 4)
            );
            g.assert(
                this.shortcutsDict instanceof g.SettingsDict,
                JSON.stringify(this.shortcutsDict, null, 4)
            );
        } else {
            this.settingsDict = lm.globalSettingsDict;
            let d1 = this.settingsDict;
            this.shortcutsDict = lm.globalBindingsDict;
            let d2 = this.shortcutsDict;
            if (d1) {
                g.assert(
                    d1 instanceof g.SettingsDict,
                    JSON.stringify(d1, null, 4)
                );
            }
            if (d2) {
                g.assert(
                    d2 instanceof g.SettingsDict,
                    JSON.stringify(d2, null, 4)
                );
            }
        }

        // Default encodings.
        this.default_at_auto_file_encoding = 'utf-8';
        this.default_derived_file_encoding = 'utf-8';
        this.new_leo_file_encoding = 'utf-8';
        // Default fonts.
        this.defaultBodyFontSize = 12; // 9 if sys.platform == "win32" else 12
        this.defaultLogFontSize = 12; // 8 if sys.platform == "win32" else 12
        this.defaultMenuFontSize = 12; // 9 if sys.platform == "win32" else 12
        this.defaultTreeFontSize = 12; // 9 if sys.platform == "win32" else 12
    }

    //@+node:felix.20220214191554.6: *3* c.config.createActivesSettingsOutline (new: #852)
    /**
     * Create and open an outline, summarizing all presently active settings.
     *
     * The outline retains the organization of all active settings files.
     *
     * See #852: https://github.com/leo-editor/leo-editor/issues/852
     */
    public createActivesSettingsOutline(): void {
        new ActiveSettingsOutline(this.c);
    }

    //@+node:felix.20220214191554.7: *3* c.config.getSource
    /**
     * Return a string representing the source file of the given setting,
     * one of ("local_file", "theme_file", "myLeoSettings", "leoSettings", "ignore", "error")
     */
    public getSource(setting: g.GeneralSetting): string {
        let trace = false;

        // ? needed ?
        // if !isinstance(setting, g.GeneralSetting):
        //     return "error"
        let w_path: string;
        try {
            w_path = setting.path!;
        } catch (exception) {
            return 'error';
        }

        let val = setting.val;
        if (val == null) {
            val = ""; // Default to empty string if undefined.
        }
        val = val.toString().substring(0, 50);

        if (!w_path) {
            // g.trace('NO PATH', setting.kind, val)
            return 'local_file';
        }

        w_path = w_path.toLowerCase();
        for (let tag of ['myLeoSettings.leo', 'leoSettings.leo']) {
            if (w_path.endsWith(tag.toLowerCase())) {
                if (tag.endsWith('.leo')) {
                    tag = tag.substring(0, tag.length - 4);
                }
                if (setting.kind === 'color') {
                    if (trace) {
                        g.trace('FOUND:', tag, setting.kind, setting.ivar, val);
                    }
                }
                return tag;
            }
        }
        const theme_path = g.app.loadManager!.theme_path;
        if (
            theme_path &&
            w_path.indexOf(g.shortFileName(theme_path.toLowerCase())) >= 0
        ) {
            if (trace) {
                g.trace(
                    'FOUND:',
                    'theme_file',
                    setting.kind,
                    setting.ivar,
                    val
                );
            }
            return 'theme_file';
        }
        // g.trace('NOT FOUND', repr(theme_path), repr(path))
        if (w_path === 'register-command' || w_path.indexOf('mode') > -1) {
            return 'ignore';
        }
        return 'local_file';
    }

    //@+node:felix.20220214191554.8: *3* c.config.Getters
    //@+node:felix.20220214191554.9: *4* c.config.findSettingsPosition & helper
    // This was not used prior to Leo 4.5.

    /**
     * Return the position for the setting in the @settings tree for c.
     */
    public findSettingsPosition(setting: string): Position | undefined {
        const munge = g.app.config.munge;

        const root = this.settingsRoot();
        if (!root || !root.__bool__()) {
            return undefined;
        }

        setting = munge(setting)!;

        for (let p of root.subtree()) {
            //BJ munge will return None if a headstring is empty
            const h: string = p.h ? munge(p.h)! || '' : '';
            if (h.startsWith(setting)) {
                return p.copy();
            }
        }
        return undefined;
    }

    //@+node:felix.20220214191554.10: *5* c.config.settingsRoot
    /**
     * Return the position of the @settings tree.
     */
    public settingsRoot(): Position | undefined {
        const c = this.c;
        for (let p of c.all_unique_positions()) {
            // #1792: Allow comments after @settings.
            if (g.match_word(p.h.trimEnd(), 0, '@settings')) {
                return p.copy();
            }
        }
        return undefined;
    }
    //@+node:felix.20220214191554.11: *4* c.config.Getters
    //@@nocolor-node
    //@+at Only the following need to be defined.
    //     get (self,setting,theType)
    //     getAbbrevDict (self)
    //     getBool (self,setting,default=None)
    //     getButtons (self)
    //     getColor (self,setting)
    //     getData (self,setting)
    //     getDirectory (self,setting)
    //     getFloat (self,setting)
    //     getFontFromParams (self,family,size,slant,weight,defaultSize=12)
    //     getInt (self,setting)
    //     getLanguage (self,setting)
    //     getMenusList (self)
    //     getOutlineData (self)
    //     getOpenWith (self)
    //     getRatio (self,setting)
    //     getShortcut (self,commandName)
    //     getString (self,setting)
    //@+node:felix.20220214191554.12: *5* c.config.get & allies
    /**
     * Get the setting and make sure its type matches the expected type.
     */
    public get(setting: string, kind?: string): any {
        const d = this.settingsDict;
        if (d) {
            // assert isinstance(d, g.TypedDict), repr(d)
            g.assert(d instanceof g.SettingsDict, d.toString());
            let val: any;
            let junk: any;
            [val, junk] = this.getValFromDict(d, setting, kind);
            return val;
        }
        return undefined;
    }
    //@+node:felix.20220214191554.13: *6* c.config.getValFromDict
    /**
     * Look up the setting in d. If warn is True, warn if the requested type
     * does not (loosely) match the actual type.
     * returns (val,exists)
     * @param d
     * @param setting
     * @param requestedType
     * @param warn flag to have method warn if value not found
     * @returns array of value, and exist flag
     */
    public getValFromDict(
        d: g.SettingsDict,
        setting: string,
        requestedType?: string,
        warn = true
    ): [any, boolean] {
        const tag = 'c.config.getValFromDict';
        const mungedSetting = g.app.config.munge(setting)!;
        const gs = d.get(mungedSetting);
        if (!gs) {
            return [undefined, false];
        }

        g.assert(gs instanceof g.GeneralSetting, gs.toString());

        const val = gs.val;
        const isNone = ['None', 'none', ''].includes(val);
        if (!this.typesMatch(gs.kind, requestedType)) {
            // New in 4.4: make sure the types match.
            // A serious warning: one setting may have destroyed another!
            // Important: this is not a complete test of conflicting settings:
            // The warning is given only if the code tries to access the setting.
            if (warn) {
                g.error(
                    `${tag}: ignoring '${setting}' setting.\n` +
                    `${tag}: '${gs.kind}' is not '${requestedType}'.\n` +
                    `${tag}: there may be conflicting settings!`
                );
            }
            return [undefined, false];
        }
        if (isNone) {
            return ['', true];
        }
        // 2011/10/24: Exists, a *user-defined* empty value.
        return [val, true];
    }
    //@+node:felix.20220214191554.14: *6* c.config.typesMatch
    /**
     * Return True if type1, the actual type, matches type2, the requeseted type.
     *
     * The following equivalences are allowed:
     *
     * - None matches anything.
     * - An actual type of string or strings matches anything *except* shortcuts.
     * - Shortcut matches shortcuts.
     *
     * @param type1 string
     * @param type2 string
     */
    public typesMatch(type1?: string, type2?: string): boolean {
        // The shortcuts logic no longer uses the get/set code.
        const shortcuts = ['shortcut', 'shortcuts'];
        if (
            (type1 && shortcuts.includes(type1)) ||
            (type2 && shortcuts.includes(type2))
        ) {
            g.trace('oops: type in shortcuts');
        }
        return (
            type1 === null ||
            type2 === null ||
            type1 === undefined ||
            type2 === undefined ||
            (type1.startsWith('string') && !shortcuts.includes(type2)) ||
            (type1 === 'language' && type2 === 'string') ||
            (type1 === 'int' && type2 === 'size') ||
            // added for javascript
            (type1 === 'int' && type2 === 'number') ||
            (type1 === 'float' && type2 === 'number') ||
            (shortcuts.includes(type1) && shortcuts.includes(type2)) ||
            type1 === type2
        );
    }
    //@+node:felix.20220214191554.15: *5* c.config.getAbbrevDict
    /**
     * Search all dictionaries for the setting & check it's type
     * @returns
     */
    public getAbbrevDict(): any {
        const d = this.get('abbrev', 'abbrev');
        return d || {};
    }
    //@+node:felix.20220214191554.16: *5* c.config.getBool
    /**
     * Return the value of @bool setting, or the default if the setting is not found.
     * @param setting value name
     * @param defaultVal value if not found as being boolean
     * @returns the boolean setting's value, or default
     */
    public getBool(setting: string, defaultVal?: boolean): boolean {
        const val = this.get(setting, 'bool');
        if ([true, false].includes(val)) {
            return val;
        }
        return defaultVal as boolean;
    }
    //@+node:felix.20220214191554.17: *5* c.config.getColor
    /**
     * Return the value of @color setting.
     * @param setting string name of setting
     * @returns color string
     */
    public getColor(setting: string): string {
        let col: string = this.get(setting, 'color');
        while (col && col.startsWith('@')) {
            col = this.get(col.substring(1), 'color');
        }
        return col;
    }
    //@+node:felix.20220214191554.18: *5* c.config.getData
    /**
     * Return a list of non-comment strings in the body text of @data setting.
     * @param setting
     * @param strip_comments
     * @param strip_data
     */
    public getData(
        setting: string,
        strip_comments = true,
        strip_data = true
    ): string[] {
        // 904: Add local abbreviations to global settings.
        const append: boolean = setting === 'global-abbreviations';
        let data0: string[] = [];
        if (append) {
            data0 = g.app.config.getData(setting, strip_comments, strip_data);
        }
        let data: string | string[] = this.get(setting, 'data');
        // New in Leo 4.11: parser.doData strips only comments now.
        // New in Leo 4.12: parser.doData strips *nothing*.
        if (typeof data === 'string' || data instanceof String) {
            data = [data as string];
        }
        if (data && data.length && strip_comments) {
            // data = [z for z in data if not z.strip().startswith('#')]
            data = data.filter((z) => {
                return !z.trim().startsWith('#');
            });
        }
        if (data && data.length && strip_data) {
            // data = [z.strip() for z in data if z.strip()]
            data = data
                .map((z) => {
                    return z.trim();
                })
                .filter((z) => {
                    return !!z;
                });
        }
        if (append && JSON.stringify(data) !== JSON.stringify(data0)) {
            if (data && data.length) {
                data.push(...data0);
            } else {
                data = data0;
            }
        }
        return data as string[];
    }
    //@+node:felix.20220214191554.19: *5* c.config.getOutlineData
    /**
     * Return the pastable (xml) text of the entire @outline-data tree.
     * @param setting
     * @returns string
     */
    public getOutlineData(setting: string): string[] {
        let data = this.get(setting, 'outlinedata');
        if (setting === 'tree-abbreviations') {
            // 904: Append local tree abbreviations to the global abbreviations.
            const data0 = g.app.config.getOutlineData(setting);
            if (data && data0 && data !== data0) {
                g.assert(
                    typeof data0 === 'string' || data0 instanceof String
                );
                g.assert(
                    typeof data === 'string' || data instanceof String
                );
                // We can't merge the data here: they are .leo files!
                // abbrev.init_tree_abbrev_helper does the merge.
                data = [data0, data];
            }
        }
        return data;
    }
    //@+node:felix.20220214191554.20: *5* c.config.getDirectory
    /**
     * Return the value of @directory setting, or None if the directory does not exist.
     * @param setting
     */
    public async getDirectory(setting: string): Promise<string | undefined> {
        // Fix https://bugs.launchpad.net/leo-editor/+bug/1173763
        const theDir: string = this.get(setting, 'directory');
        if (!theDir) {
            return undefined;
        }
        const w_exists = await g.os_path_exists(theDir);
        const w_isDir = await g.os_path_isdir(theDir);
        if (w_exists && w_isDir) {
            return theDir;
        }
        return undefined;
    }
    //@+node:felix.20220214191554.21: *5* c.config.getFloat
    /**
     * Return the value of @float setting.
     * @param setting
     */
    public getFloat(setting: string): number | undefined {
        let val = this.get(setting, 'float');
        try {
            val = Number(val);
            return val;
        } catch (TypeError) {
            return undefined;
        }
    }
    //@+node:felix.20220214191554.22: *5* c.config.getFontFromParams
    /**
     * Compute a font from font parameters. This should be used *only*
        by the syntax coloring code.  Otherwise, use Leo's style sheets.

        Arguments are the names of settings to be use.
        Default to size=12, slant="roman", weight="normal".

        Return None if there is no family setting so we can use system default fonts.
     * @param family 
     * @param size 
     * @param slant 
     * @param weight 
     * @param defaultSize 
     */
    public getFontFromParams(
        family: string,
        size: number,
        slant: number,
        weight: number,
        defaultSize = 12
    ): string {
        return '';
    }
    //@+node:felix.20220214191554.23: *5* c.config.getInt
    /**
     * Return the value of @int setting.
     * @param setting
     */
    public getInt(setting: string): number | undefined {
        let val = this.get(setting, 'int');
        try {
            val = Number(val);
            return val;
        } catch (TypeError) {
            return undefined;
        }
    }
    //@+node:felix.20220214191554.24: *5* c.config.getLanguage
    /**
     * Return the setting whose value should be a language known to Leo.
     * @param setting
     */
    public getLanguage(setting: string): string {
        const language = this.getString(setting);
        return language;
    }
    //@+node:felix.20220214191554.25: *5* c.config.getMenusList
    /**
     * Return the list of entries for the @menus tree.
     */
    public getMenusList(): string[] {
        const aList: string[] | undefined = this.get('menus', 'menus');
        // aList is typically empty.
        return aList || g.app.config.menusList;
    }
    //@+node:felix.20220214191554.26: *5* c.config.getOpenWith
    /**
     * Return a list of dictionaries corresponding to @openwith nodes.
     * @returns
     */
    public getOpenWith(): any {
        const val = this.get('openwithtable', 'openwithtable');
        return val;
    }
    //@+node:felix.20220214191554.27: *5* c.config.getRatio
    /**
     * Return the value of @float setting, or None if there is an error.
     */
    public getRatio(setting: string): any {
        let val = this.get(setting, 'ratio');
        try {
            val = Number(val);
            if (0.0 <= val && val <= 1.0) {
                return val;
            }
        } catch (TypeError) {
            // pass
        }
        return undefined;
    }
    //@+node:felix.20220214191554.28: *5* c.config.getSettingSource
    /**
     * return the name of the file responsible for setting.
     * @param setting
     */
    public getSettingSource(setting: string): [string, any] | undefined {
        const d = this.settingsDict;
        if (d) {
            g.assert(d instanceof g.SettingsDict, d.toString());
            const bi = d.get(setting);
            if (bi === undefined) {
                return ['unknown setting', undefined];
            }
            return [bi.path!, bi.val];
        }
        //
        // lm.readGlobalSettingsFiles is opening a settings file.
        // lm.readGlobalSettingsFiles has not yet set lm.globalSettingsDict.
        g.assert(d === undefined || d === null);
        return undefined;
    }
    //@+node:felix.20220214191554.29: *5* c.config.getShortcut
    // no_menu_dict: Dict[Cmdr, bool] = {}

    // ? Needed ?
    /**
     * Return rawKey,accel for shortcutName
     * @param commandName
     * @returns
     */
    public getShortcut(commandName: string): [string | undefined, any[]] {
        // c = this.c
        // d = this.shortcutsDict
        // if not c.frame.menu:
        //     if c not in this.no_menu_dict:
        //         this.no_menu_dict[c] = True
        //         g.trace(f"no menu: {c.shortFileName()}:{commandName}")
        //     return None, []
        // if d:
        //     assert isinstance(d, g.SettingsDict), repr(d)  // was TypedDictOfLists.
        //     key = c.frame.menu.canonicalizeMenuName(commandName)
        //     key = key.replace('&', '')  // Allow '&' in names.
        //     aList = d.get(commandName, [])
        //     if aList:  // A list of g.BindingInfo objects.
        //         // It's important to filter empty strokes here.
        //         aList = [z for z in aList
        //             if z.stroke and z.stroke.lower() != 'none']
        //     return key, aList
        //             //
        // // lm.readGlobalSettingsFiles is opening a settings file.
        // // lm.readGlobalSettingsFiles has not yet set lm.globalSettingsDict.

        return [undefined, []];
    }
    //@+node:felix.20220214191554.30: *5* c.config.getString
    /**
     * Return the value of @string setting.
     * @param setting
     */
    public getString(setting: string): string {
        return this.get(setting, 'string');
    }
    //@+node:felix.20220214191554.31: *4* c.config.Getters: redirect to g.app.config
    /**
     * Return a list of tuples (x,y) for common @button nodes.
     * @param setting
     */
    public getButtons(): any {
        return g.app.config.atCommonButtonsList; // unusual.
    }
    /**
     * Return the list of tuples (headline,script) for common @command nodes.
     * @param setting
     */
    public getCommands(): any {
        return g.app.config.atCommonCommandsList; // unusual.
    }
    /**
     * Return the body text of the @enabled-plugins node.
     * @param setting
     */
    public getEnabledPlugins(): any {
        return g.app.config.enabledPluginsString; // unusual.
    }
    /**
     * Return the list of recently opened files.
     * @param setting
     */
    public getRecentFiles(): string[] {
        return g.app.config.getRecentFiles();
    }
    //@+node:felix.20220214191554.32: *4* c.config.isLocalSetting
    /**
     * Return True if the indicated setting comes from a local .leo file.
     * @param setting
     */
    public isLocalSetting(setting: string, kind: string): boolean {
        if (
            !kind ||
            ['shortcut', 'shortcuts', 'openwithtable'].includes(kind)
        ) {
            return false;
        }
        let key = g.app.config.munge(setting);
        if (key === undefined) {
            return false;
        }
        if (!this.settingsDict) {
            return false;
        }
        let gs = this.settingsDict.get(key);
        if (!gs) {
            return false;
        }

        // assert isinstance(gs, g.GeneralSetting), repr(gs)
        let w_path: string = gs.path!.toLowerCase();
        ['myLeoSettings.leo', 'leoSettings.leo'].forEach((fn) => {
            if (w_path.endsWith(fn.toLowerCase())) {
                return false;
            }
        });
        return true;
    }
    //@+node:felix.20220214191554.33: *4* c.config.isLocalSettingsFile
    /**
     * Return true if c is not leoSettings.leo or myLeoSettings.leo
     * @param setting
     */
    public isLocalSettingsFile(): any {
        const c = this.c;

        const fn = c.shortFileName().toLowerCase();
        ['leoSettings.leo', 'myLeoSettings.leo'].forEach((fn2) => {
            if (fn.endsWith(fn2.toLowerCase())) {
                return false;
            }
        });

        return true;
    }
    //@+node:felix.20220214191554.34: *4* c.exists
    /**
     * Return true if a setting of the given kind exists, even if it is None.
     * @param setting
     */
    public exists(c: Commands, setting: string, kind: string): boolean {
        let d = this.settingsDict;
        let junk: any;
        let found: boolean;
        if (d) {
            [junk, found] = this.getValFromDict(d, setting, kind);
            if (found) {
                return true;
            }
        }
        return false;
    }
    //@+node:felix.20220214191554.35: *3* c.config.printSettings
    /**
     * Prints the value of every setting, except key bindings and commands and open-with tables.
     * The following shows where the active setting came from:
     *
     *  -     leoSettings.leo,
     *  -  @  @button, @command, @mode.
     *  - [D] default settings.
     *  - [F] indicates the file being loaded,
     *  - [M] myLeoSettings.leo,
     *  - [T] theme .leo file.
     */
    public printSettings(): void {
        const legend =
            'legend:' +
            '    leoSettings.leo' +
            '@  @button, @command, @mode' +
            '[D] default settings' +
            '[F] loaded .leo File' +
            '[M] myLeoSettings.leo' +
            '[T] theme .leo file.';

        const c = this.c;

        // legend = textwrap.dedent(legend)
        let result: string[] = [];
        let name: string;
        let val: any;
        let c_junk: Commands;
        let letter: any;
        for (let p_configEntry of g.app.config.config_iter(c)) {
            [name, val, c_junk, letter] = p_configEntry;
            let kind = letter === ' ' ? '   ' : `[${letter}]`;
            result.push(`${kind} ${name} = ${val}\n`);
        }
        // Use a single g.es statement.
        result.push('\n' + legend);
        if (g.unitTesting) {
            // pass  // print(''.join(result))
        } else {
            g.es_print('', result.join(''), 'Settings');
        }
    }

    //@+node:felix.20220214191554.36: *3* c.config.set
    /**
     * Init the setting for name to val.
     *
     * The "p" arg is not used.
     */
    public set(
        p: any,
        kind: string,
        name: string,
        val: any,
        warn = true
    ): void {
        const c = this.c;

        // Note: when kind is 'shortcut', name is a command name.
        let key: string = g.app.config.munge(name)!;
        let d = this.settingsDict;
        g.assert(d instanceof g.SettingsDict, d.toString());
        let gs = d.get(key);
        if (gs) {
            // assert isinstance(gs, g.GeneralSetting), repr(gs)
            let w_path = gs.path!;
            if (warn && g.finalize(c.mFileName) !== g.finalize(w_path)) {
                // #1341.
                g.es('over-riding setting:', name, 'from', w_path);
            }
        }

        // ? equivalent of d[key] = g.GeneralSetting(kind, path=c.mFileName, val=val, tag='setting')
        d.set(
            key,
            new g.GeneralSetting({
                kind: kind,
                path: c.mFileName,
                val: val,
                tag: 'setting',
            })
        );
    }
    //@+node:felix.20220214191554.37: *3* c.config.settingIsActiveInPath
    /**
     * Return True if settings file given by path actually defines the setting, gs.
     */
    public settingIsActiveInPath(gs: any, target_path: string): boolean {
        // assert isinstance(gs, g.GeneralSetting), repr(gs)
        return gs.path === target_path;
    }
    //@+node:felix.20220214191554.38: *3* c.config.setUserSetting
    /**
     * Find and set the indicated setting, either in the local file or in
     * myLeoSettings.leo.
     */
    public async setUserSetting(setting: string, value: any): Promise<void> {
        let c: Commands | undefined = this.c;

        let fn: string = g.shortFileName(c.fileName());
        let p: Position | undefined = this.findSettingsPosition(setting);

        if (!p || !p.__bool__()) {
            c = await c.openMyLeoSettings();
            if (!c) {
                return;
            }
            fn = 'myLeoSettings.leo';
            p = c.config.findSettingsPosition(setting);
        }
        if (!p) {
            const root = c.config.settingsRoot();
            if (!root) {
                return;
            }
            fn = 'leoSettings.leo';
            p = c.config.findSettingsPosition(setting);
            if (!p) {
                p = root.insertAsLastChild();
            }
        }
        let h = setting;
        let i = h.indexOf('=');
        if (i > -1) {
            h = h.slice(0, i).trim();
        }
        p.h = `${h} = ${value}`;
        console.log(`Updated '${setting}' in ${fn}`); // #2390.
        //
        // Delay the second redraw until idle time.
        c.setChanged();
        p.setDirty();
        c.redraw_later();
    }
    //@-others
}
//@+node:felix.20220602232038.1: ** class SettingsTreeParser (ParserBaseClass)
/**
 * A class that inits settings found in an @settings tree.
 *
 * Used by read settings logic.
 */
export class SettingsTreeParser extends ParserBaseClass {
    constructor(c: Commands, localFlag = true) {
        super(c, localFlag);
    }

    //@+others
    //@+node:felix.20220602232038.2: *3* ctor (SettingsTreeParser)
    //@+node:felix.20220602232038.3: *3* visitNode (SettingsTreeParser)
    /**
     * Init any settings found in node p.
     */
    public async visitNode(p: Position): Promise<string | undefined> {
        p = p.copy();

        const munge = g.app.config.munge;
        let kind;
        let name;
        let val;
        [kind, name, val] = this.parseHeadline(p.h);

        kind = munge(kind);

        const isNone = ['None', 'none', '', undefined].includes(val);

        if (!kind) {
            // Not an @x node. (New in Leo 4.4.4)
            // pass
        } else if (kind === 'settings') {
            // pass
        } else if (SettingsTreeParser.basic_types.includes(kind) && isNone) {
            // None is valid for all basic types.
            this.set(p, kind, name!, undefined);
        } else if (
            SettingsTreeParser.control_types.includes(kind) ||
            SettingsTreeParser.basic_types.includes(kind)
        ) {
            const f = this.dispatchDict[kind];
            if (f) {
                try {
                    const result = await Promise.resolve(f.bind(this)(p, kind, name!, val));
                } catch (exception) {
                    g.es_exception(exception);
                }
            } else {
                g.pr('*** no handler', kind);
            }
        }
        return undefined;
    }

    //@-others
}

//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
