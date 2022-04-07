//@+leo-ver=5-thin
//@+node:felix.20211031230132.1: * @file src/core/leoConfig.ts
//@+<< imports >>
//@+node:felix.20211031230614.1: ** << imports >>
import { Commands } from './leoCommands';
import * as g from './leoGlobals';
import { Position } from './leoNodes';

//@-<< imports >>
//@+others
//@+node:felix.20220206213914.1: ** class GlobalConfigManager
/**
 * A class to manage configuration settings.
 */
export class GlobalConfigManager {

    // Class data...
    //@+<< gcm.defaultsDict >>
    //@+node:felix.20220206213914.2: *3* << gcm.defaultsDict >>
    //@+at This contains only the "interesting" defaults.
    // Ints and bools default to 0, floats to 0.0 and strings to "".
    //@@c
    public defaultBodyFontSize = 12;  // 9 if sys.platform == "win32" else 12
    public defaultLogFontSize = 12; // 8 if sys.platform == "win32" else 12
    public defaultMenuFontSize = 12;  // 9 if sys.platform == "win32" else 12
    public defaultTreeFontSize = 12;  // 9 if sys.platform == "win32" else 12

    defaultsDict = new g.TypedDict(
        'g.app.config.defaultsDict',
        'string',
        'GeneralSetting'
    );

    public defaultsData: [string, string, any][] = [
        // compare options...
        ["ignore_blank_lines", "bool", true],
        ["limit_count", "int", 9],
        ["print_mismatching_lines", "bool", true],
        ["print_trailing_lines", "bool", true],
        // find/change options...
        ["search_body", "bool", true],
        ["whole_word", "bool", true],
        // Prefs panel.
        // ("default_target_language","language","python"),
        ["target_language", "language", "python"],  // Bug fix: 6/20,2005.
        ["tab_width", "int", -4],
        ["page_width", "int", 132],
        ["output_doc_chunks", "bool", true],
        ["tangle_outputs_header", "bool", true],
        // Syntax coloring options...
        // Defaults for colors are handled by leoColor.py.
        ["color_directives_in_plain_text", "bool", true],
        ["underline_undefined_section_names", "bool", true],
        // Window options...
        ["body_pane_wraps", "bool", true],
        ["body_text_font_family", "family", "Courier"],
        ["body_text_font_size", "size", this.defaultBodyFontSize],
        ["body_text_font_slant", "slant", "roman"],
        ["body_text_font_weight", "weight", "normal"],
        ["enable_drag_messages", "bool", true],
        ["headline_text_font_family", "string", undefined],
        ["headline_text_font_size", "size", this.defaultLogFontSize],
        ["headline_text_font_slant", "slant", "roman"],
        ["headline_text_font_weight", "weight", "normal"],
        ["log_text_font_family", "string", undefined],
        ["log_text_font_size", "size", this.defaultLogFontSize],
        ["log_text_font_slant", "slant", "roman"],
        ["log_text_font_weight", "weight", "normal"],
        ["initial_window_height", "int", 600],
        ["initial_window_width", "int", 800],
        ["initial_window_left", "int", 10],
        ["initial_window_top", "int", 10],
        ["initial_split_orientation", "string", "vertical"],  // was initial_splitter_orientation.
        ["initial_vertical_ratio", "ratio", 0.5],
        ["initial_horizontal_ratio", "ratio", 0.3],
        ["initial_horizontal_secondary_ratio", "ratio", 0.5],
        ["initial_vertical_secondary_ratio", "ratio", 0.7],
        // ("outline_pane_scrolls_horizontally","bool",False),
        ["split_bar_color", "color", "LightSteelBlue2"],
        ["split_bar_relief", "relief", "groove"],
        ["split_bar_width", "int", 7],
    ];

    //@-<< gcm.defaultsDict >>
    //@+<< gcm.encodingIvarsDict >>
    //@+node:felix.20220206213914.3: *3* << gcm.encodingIvarsDict >>
    encodingIvarsDict = new g.TypedDict(
        'g.app.config.encodingIvarsDict',
        'string',
        'GeneralSetting'
    );

    public encodingIvarsData: [string, string, string][] = [
        ["default_at_auto_file_encoding", "string", "utf-8"],
        ["default_derived_file_encoding", "string", "utf-8"],
        ["new_leo_file_encoding", "string", "UTF-8"],
        // Upper case for compatibility with previous versions.
        //
        // The defaultEncoding ivar is no longer used,
        // so it doesn't override better defaults.
    ];


    //@-<< gcm.encodingIvarsDict >>
    //@+<< gcm.ivarsDict >>
    //@+node:felix.20220206213914.4: *3* << gcm.ivarsDict >>
    // Each of these settings sets the corresponding ivar.
    //  Also, the LocalConfigManager class inits the corresponding commander ivar.

    public ivarsDict = new g.TypedDict(
        'g.app.config.ivarsDict',
        'string',
        'GeneralSetting'
    );

    public ivarsData: [string, string, any][] = [
        ["at_root_bodies_start_in_doc_mode", "bool", true],
        // For compatibility with previous versions.
        ["create_nonexistent_directories", "bool", false],
        ["output_initial_comment", "string", ""],
        // "" for compatibility with previous versions.
        ["output_newline", "string", "nl"],
        ["page_width", "int", "132"],
        ["read_only", "bool", true],
        ["redirect_execute_script_output_to_log_pane", "bool", false],
        ["relative_path_base_directory", "string", "!"],
        ["remove_sentinels_extension", "string", ".txt"],
        ["save_clears_undo_buffer", "bool", false],
        ["stylesheet", "string", undefined],
        ["tab_width", "int", -4],
        ["target_language", "language", "python"],
        // Bug fix: added: 6 / 20 / 2005.
        ["trailing_body_newlines", "string", "asis"],
        ["use_plugins", "bool", true],
        // New in 4.3: use_plugins = True by default.
        ["undo_granularity", "string", "word"],
        // "char", "word", "line", "node"
        ["write_strips_blank_lines", "bool", false],
    ];



    //@-<< gcm.ivarsDict >>

    public use_plugins: boolean;
    public create_nonexistent_directories: boolean;
    public atCommonButtonsList: any[];
    public atCommonCommandsList: any[];
    public atLocalButtonsList: any[];
    public atLocalCommandsList: any[];
    public buttonsFileName: string;
    public configsExist: boolean;

    public defaultFont: string | undefined;
    public defaultFontFamily: string | undefined;
    public enabledPluginsFileName: string | undefined;
    public enabledPluginsString: string;
    public inited: boolean;
    public menusList: string[];
    public menusFileName: string;
    public modeCommandsDict: g.TypedDict;// { [key: string]: any };
    public panes: any;
    public sc: any;
    public tree: any;

    public dictList!: { [key: string]: any }[];
    public recentFiles!: string[];

    public relative_path_base_directory!: string;

    public at_root_bodies_start_in_doc_mode!: boolean; // = true;
    public default_derived_file_encoding!: string; // = 'utf-8';
    public output_newline!: string; // = 'nl';
    public redirect_execute_script_output_to_log_pane!: boolean; // = true;


    //@+others

    //@+node:felix.20220207005211.1: *3* gcm.Birth...
    //@+node:felix.20220207005211.2: *4* gcm.ctor
    constructor() {
        //
        // Set later.  To keep pylint happy.
        if (0) {  // No longer needed, now that setIvarsFromSettings always sets gcm ivars.
            // this.at_root_bodies_start_in_doc_mode = true;
            // this.default_derived_file_encoding = 'utf-8';
            // this.output_newline = 'nl';
            // this.redirect_execute_script_output_to_log_pane = true;
            // this.relative_path_base_directory = '!';
        }


        this.use_plugins = false;  // Required to keep pylint happy.
        this.create_nonexistent_directories = false;  // Required to keep pylint happy.
        this.atCommonButtonsList = []; // List of info for common @buttons nodes.
        this.atCommonCommandsList = []; // List of info for common @commands nodes.
        this.atLocalButtonsList = []; // List of positions of @button nodes.
        this.atLocalCommandsList = [];  // List of positions of @command nodes.
        this.buttonsFileName = '';
        this.configsExist = false;  // True when we successfully open a setting file.
        this.defaultFont = undefined;  // Set in gui.getDefaultConfigFont.
        this.defaultFontFamily = undefined;  // Set in gui.getDefaultConfigFont.
        this.enabledPluginsFileName = undefined;
        this.enabledPluginsString = '';
        this.inited = false;
        this.menusList = [];
        this.menusFileName = '';

        this.modeCommandsDict = new g.TypedDict(
            'modeCommandsDict',
            'string',
            'TypedDict');  // was TypedDictOfLists.
        // Inited later...
        this.panes = undefined;
        this.sc = undefined;
        this.tree = undefined;

        this.inited = true;

        this.initDicts();
        // this.initIvarsFromSettings(); // TODO ?
        this.initRecentFiles();

    }

    //@+node:felix.20220207005211.3: *4* gcm.initDicts
    /**
     * Only the settings parser needs to search all dicts.
      */
    public initDicts(): void {
        // Only the settings parser needs to search all dicts.
        this.dictList = [this.defaultsDict];


        let key: string;
        let kind: string;
        let val: any;

        this.defaultsData.forEach(element => {
            [key, kind, val] = element;
            this.defaultsDict.d[this.munge(key)!] = new g.GeneralSetting(
                {
                    kind: kind, setting: key, val: val, tag: 'defaults'
                }
            );
        });

        this.ivarsData.forEach(element => {
            [key, kind, val] = element;
            this.ivarsDict.d[this.munge(key)!] = new g.GeneralSetting(
                {
                    kind: kind, ivar: key, val: val, tag: 'ivars'
                }

            );
        });

        this.encodingIvarsData.forEach(element => {
            [key, kind, val] = element;
            this.encodingIvarsDict.d[this.munge(key)!] = new g.GeneralSetting(
                {
                    kind: kind, encoding: val, ivar: key, tag: 'encoding'
                }
            );
        });

    }

    //@+node:felix.20220207005211.4: *4* gcm.initIvarsFromSettings & helpers

    public initIvarsFromSettings(): void {

        Object.keys(this.encodingIvarsDict.d).sort().forEach(ivar => {
            this.initEncoding(ivar);
        });

        Object.keys(this.ivarsDict.d).sort().forEach(ivar => {
            this.initIvar(ivar);
        });

    }


    //@+node:felix.20220207005211.5: *5* initEncoding
    /**
     * Init g.app.config encoding ivars during initialization.
     */
    public initEncoding(key: string): void {
        // Important: The key is munged.
        const gs = this.encodingIvarsDict.get(key);
        (this as any)[gs.ivar] = gs.encoding;
        if (gs.encoding && !g.isValidEncoding(gs.encoding)) {
            g.es('g.app.config: bad encoding: ' + `${gs.ivar}: ${gs.encoding}`);
        }
    }

    //@+node:felix.20220207005211.6: *5* initIvar
    /**
     * Init g.app.config ivars during initialization.
     *
     * This does NOT init the corresponding commander ivars.
     *
     * Such initing must be done in setIvarsFromSettings.
     */
    public initIvar(key: string): void {
        // Important: the key is munged.
        const d = this.ivarsDict;
        const gs = d.get(key);

        (this as any)[gs.ivar] = gs.val;
        // setattr(self, gs.ivar, gs.val)

    }

    //@+node:felix.20220207005211.7: *4* gcm.initRecentFiles
    public initRecentFiles(): void {
        this.recentFiles = [];
    }

    //@+node:felix.20220207005211.8: *4* gcm.setIvarsFromSettings
    /**
     * Init g.app.config ivars or c's ivars from settings.
     *
     * - Called from c.initSettings with c = None to init g.app.config ivars.
     * - Called from c.initSettings to init corresponding commmander ivars.
     */
    public setIvarsFromSettings(c?: Commands): void {
        if (g.app.loadedThemes.length) {
            return;
        }
        if (!this.inited) {
            return;
        }
        // Ignore temporary commanders created by readSettingsFiles.
        const d = this.ivarsDict;
        const keys = d.keys().sort();

        for (let key of keys) {
            const gs = d.get(key);
            if (gs) {
                // ? needed ?
                // assert isinstance(gs, g.GeneralSetting)
                const ivar = gs.ivar;  // The actual name of the ivar.
                const kind = gs.kind;
                let val: any;
                if (c) {
                    val = c.config.get(key, kind);
                } else {
                    val = this.get(key, kind);  // Don't use bunch.val!
                }
                if (c) {
                    console.log('-------------------------------SETTING c IVAR : ' + ivar + " to " + val);

                    (c as any)[ivar] = val;
                }
                if (true) {  // Always set the global ivars.
                    (this as any)[ivar] = val;
                }
            }

        }
    }

    //@+node:felix.20220207005224.1: *3* gcm.Getters...
    //@+node:felix.20220207005224.2: *4* gcm.canonicalizeSettingName (munge)
    public canonicalizeSettingName(name?: string): string | undefined {
        if (name === undefined) {
            return undefined;
        }
        name = name.toLowerCase();

        ['-', '_', ' ', '\n'].forEach(ch => {
            name = name!.split(ch).join('');
        });

        return name ? name : undefined;

    }

    public munge(name?: string): string | undefined {
        return this.canonicalizeSettingName(name);
    }

    // ! ALIAS !
    // munge = canonicalizeSettingName
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

        const lm = g.app.loadManager;

        // It *is* valid to call this method: it returns the global settings.
        const d = lm!.globalSettingsDict;
        if (d) {
            // ? needed ?
            // assert isinstance(d, g.TypedDict), repr(d)
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
    public getValFromDict(d: g.TypedDict, setting: string, requestedType: string, warn: boolean = true): [any, boolean] {
        let tag = 'gcm.getValFromDict';
        const gs = d.get(this.munge(setting)!);
        if (!gs) {
            return [undefined, false];
        }
        // ? needed ?
        // assert isinstance(gs, g.GeneralSetting), repr(gs)
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
            type1 === undefined
            || type2 === undefined
            || type1.startsWith('string') && !shortcuts.includes(type2)
            || type1 === 'language' && type2 === 'string'
            || type1 === 'int' && type2 === 'size'
            || (shortcuts.includes(type1) && shortcuts.includes(type2))
            || type1 === type2
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
        const val = this.get(setting, "bool");
        if ([true, false].includes(val)) {
            return val;
        }
        return defaultVal;
    }
    //@+node:felix.20220207005224.9: *4* gcm.getButtons
    /* def getButtons(self):
        """Return a list of tuples (x,y) for common @button nodes."""
        return g.app.config.atCommonButtonsList
     */
    //@+node:felix.20220207005224.10: *4* gcm.getColor
    /* def getColor(self, setting):
        """Return the value of @color setting."""
        col = self.get(setting, "color")
        while col and col.startswith('@'):
            col = self.get(col[1:], "color")
        return col
     */
    //@+node:felix.20220207005224.11: *4* gcm.getCommonCommands
    /* def getCommonAtCommands(self):
        """Return the list of tuples (headline,script) for common @command nodes."""
        return g.app.config.atCommonCommandsList
     */
    //@+node:felix.20220207005224.12: *4* gcm.getData & getOutlineData
    /**
     * Return a list of non-comment strings in the body text of @data setting.
     */
    public getData(setting: string, strip_comments = true, strip_data = true): string[] {

        let data: string[] = this.get(setting, "data") || [];
        // New in Leo 4.12.1: add two keyword arguments, with legacy defaults.
        if (data && data.length && strip_comments) {
            data = data.filter((z) => { !z.trim().startsWith('#') });
        }
        if (data && data.length && strip_data) {
            data = data.map((z) => { return z.trim(); }).filter((z) => { return !!z; });
        }
        return data;
    }

    /**
     * Return the pastable (xml text) of the entire @outline-data tree.
     * @param setting  
     * @returns 
     */
    public getOutlineData(setting: string): string[] {
        return this.get(setting, "outlinedata");
    }

    //@+node:felix.20220207005224.13: *4* gcm.getDirectory
    /* def getDirectory(self, setting):
        """Return the value of @directory setting, or None if the directory does not exist."""
        # Fix https://bugs.launchpad.net/leo-editor/+bug/1173763
        theDir = self.get(setting, 'directory')
        if g.os_path_exists(theDir) and g.os_path_isdir(theDir):
            return theDir
        return None
     */
    //@+node:felix.20220207005224.14: *4* gcm.getEnabledPlugins
    /* def getEnabledPlugins(self):
        """Return the body text of the @enabled-plugins node."""
        return g.app.config.enabledPluginsString
     */
    //@+node:felix.20220207005224.15: *4* gcm.getFloat
    /* def getFloat(self, setting):
        """Return the value of @float setting."""
        val = self.get(setting, "float")
        try:
            val = float(val)
            return val
        except TypeError:
            return None
     */
    //@+node:felix.20220207005224.16: *4* gcm.getFontFromParams
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
    /* def getInt(self, setting):
        """Return the value of @int setting."""
        val = self.get(setting, "int")
        try:
            val = int(val)
            return val
        except TypeError:
            return None
     */
    //@+node:felix.20220207005224.18: *4* gcm.getLanguage
    /* def getLanguage(self, setting):
        """Return the setting whose value should be a language known to Leo."""
        language = self.getString(setting)
        return language
     */
    //@+node:felix.20220207005224.19: *4* gcm.getMenusList
    /* def getMenusList(self):
        """Return the list of entries for the @menus tree."""
        aList = self.get('menus', 'menus')
        # aList is typically empty.
        return aList or g.app.config.menusList
     */
    //@+node:felix.20220207005224.20: *4* gcm.getOpenWith
    /* def getOpenWith(self):
        """Return a list of dictionaries corresponding to @openwith nodes."""
        val = self.get('openwithtable', 'openwithtable')
        return val
     */
    //@+node:felix.20220207005224.21: *4* gcm.getRatio
    /* def getRatio(self, setting):
        """Return the value of @float setting.

        Warn if the value is less than 0.0 or greater than 1.0."""
        val = self.get(setting, "ratio")
        try:
            val = float(val)
            if 0.0 <= val <= 1.0:
                return val
        except TypeError:
            pass
        return None
     */
    //@+node:felix.20220207005224.22: *4* gcm.getRecentFiles
    /* def getRecentFiles(self):
        """Return the list of recently opened files."""
        return self.recentFiles
     */
    //@+node:felix.20220207005224.23: *4* gcm.getString
    /**
     * Return the value of @string setting.
     */
    public getString(setting: string): string {
        return this.get(setting, "string");
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
    public *config_iter(c: Commands): Generator<[string, any, Commands, string]> {

        const lm = g.app.loadManager!;
        const d = c ? c.config.settingsDict : lm.globalSettingsDict;

        let limit = c.config.getInt('print-settings-at-data-limit');
        if (limit === undefined) {
            limit = 20;  // A resonable default.
        }
        // pylint: disable=len-as-condition
        for (let key of d.keys().sort()) {
            // return Object.keys(this.d);
            const gs = d.get(key);
            // assert isinstance(gs, g.GeneralSetting), repr(gs);
            if (gs && gs.kind) {
                const letter: string = lm.computeBindingLetter(c, gs.path);
                let val: string[] | string = gs.val;
                if (gs.kind === 'data') {
                    // #748: Remove comments
                    const aList = (val as string[])
                        .filter((z) => { return z.trim() && !z.trim().startsWith('#'); })
                        .map((z) => { return '        ' + z.trimRight(); });
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

                } else if ((typeof val === 'string' || val instanceof String) && val.startsWith('<?xml')) {
                    val = '<xml>';
                }
                let key2 = `@${gs.kind} ${key}`;
                yield [key2, val, c, letter];
            }
        }
    }

    //@+node:felix.20220206213914.37: *3* gcm.valueInMyLeoSettings
    /* def valueInMyLeoSettings(self, settingName):
        """Return the value of the setting, if any, in myLeoSettings.leo."""
        lm = g.app.loadManager
        d = lm.globalSettingsDict.d
        gs = d.get(self.munge(settingName))
            # A GeneralSetting object.
        if gs:
            path = gs.path
            if path.find('myLeoSettings.leo') > -1:
                return gs.val
        return None
     */
    //@-others

}
//@+node:felix.20220214191554.1: ** class LocalConfigManager
/**
 * A class to hold config settings for commanders.
 */
export class LocalConfigManager {

    public c: Commands;
    public settingsDict: g.TypedDict;
    public shortcutsDict: g.TypedDict;

    public defaultBodyFontSize: number;
    public defaultLogFontSize: number;
    public defaultMenuFontSize: number;
    public defaultTreeFontSize: number;

    // TODO : REPLACE WITH REAL TRANSLATION FROM LEO
    public default_derived_file_encoding!: string;//  = "utf-8";
    public default_at_auto_file_encoding!: string;// = "utf-8";
    public new_leo_file_encoding!: string; // = "UTF-8";
    public save_clears_undo_buffer!: boolean; // = false;

    //@+others
    //@+node:felix.20220214191554.2: *3* c.config.Birth
    //@+node:felix.20220214191554.3: *4* c.config.ctor
    constructor(c: Commands, previousSettings?: LocalConfigManager) {
        this.c = c;

        const lm = g.app.loadManager;
        //
        // c.__init__ and helpers set the shortcuts and settings dicts for local files.
        if (previousSettings) {
            this.settingsDict = previousSettings.settingsDict;
            this.shortcutsDict = previousSettings.shortcutsDict;
            //assert isinstance(this.settingsDict, g.TypedDict), repr(this.settingsDict)
            //assert isinstance(this.shortcutsDict, g.TypedDict), repr(this.shortcutsDict)
            // was TypedDictOfLists.
        } else {
            this.settingsDict = lm!.globalSettingsDict;
            this.shortcutsDict = lm!.globalBindingsDict;
            // assert d1 is None or isinstance(d1, g.TypedDict), repr(d1)
            // assert d2 is None or isinstance(d2, g.TypedDict), repr(d2)  // was TypedDictOfLists.
        }
        // Define these explicitly to eliminate a pylint warning.
        if (0) {
            // No longer needed now that c.config.initIvar always sets
            // both c and c.config ivars.
            // this.default_derived_file_encoding = g.app.config.default_derived_file_encoding;
            // this.redirect_execute_script_output_to_log_pane = g.app.config.redirect_execute_script_output_to_log_pane;
        }

        this.defaultBodyFontSize = g.app.config.defaultBodyFontSize;
        this.defaultLogFontSize = g.app.config.defaultLogFontSize;
        this.defaultMenuFontSize = g.app.config.defaultMenuFontSize;
        this.defaultTreeFontSize = g.app.config.defaultTreeFontSize;
        for (let key of g.app.config.encodingIvarsDict.keys().sort()) {
            this.initEncoding(key);
        }
        for (let key of g.app.config.ivarsDict.keys().sort()) {
            this.initIvar(key);
        }

    }

    //@+node:felix.20220214191554.4: *4* c.config.initEncoding
    public initEncoding(key: string): void {
        // Important: the key is munged.
        const gs = g.app.config.encodingIvarsDict.get(key);
        const encodingName = gs.ivar;
        let encoding = this.get(encodingName, 'string');
        // Use the global setting as a last resort.
        // TODO check if needed
        if (!encoding) {
            encoding = (g.app.config as any)[encodingName];
        }
        (this as any)[encodingName] = encoding;
        if (encoding && !g.isValidEncoding(encoding)) {
            g.es('bad', `${encodingName}: ${encoding}`);
        }
    }

    //@+node:felix.20220214191554.5: *4* c.config.initIvar
    public initIvar(key: string): void {
        const c = this.c;
        // Important: the key is munged.
        const gs = g.app.config.ivarsDict.get(key);
        const ivarName = gs.ivar;
        const val = this.get(ivarName, undefined);
        if (val || !(this as any)[ivarName]) {
            // Set *both* the commander ivar and the c.config ivar.
            (this as any)[ivarName] = val;
            (c as any)[ivarName] = val;
            // * equivalent of
            // setattr(self, ivarName, val)
            // setattr(c, ivarName, val)
        }
    }

    //@+node:felix.20220214191554.6: *3* c.config.createActivesSettingsOutline (new: #852)
    /**
     * Create and open an outline, summarizing all presently active settings.
     *
     * The outline retains the organization of all active settings files.
     *
     * See #852: https://github.com/leo-editor/leo-editor/issues/852
     */
    // ! uncomment if needed
    // public createActivesSettingsOutline(): void {
    //     ActiveSettingsOutline(this.c);
    // }
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
        }
        catch (exception) {
            return "error";
        }

        const val = setting.val.toString().substring(0, 50);

        if (!w_path) {
            // g.trace('NO PATH', setting.kind, val)
            return "local_file";
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
        if (theme_path && w_path.indexOf(g.shortFileName(theme_path.toLowerCase())) >= 0) {
            if (trace) {
                g.trace('FOUND:', "theme_file", setting.kind, setting.ivar, val);
            }
            return "theme_file";
        }
        // g.trace('NOT FOUND', repr(theme_path), repr(path))
        if (w_path === 'register-command' || w_path.indexOf('mode') > -1) {
            return 'ignore';
        }
        return "local_file";
    }

    //@+node:felix.20220214191554.8: *3* c.config.Getters
    //@+node:felix.20220214191554.9: *4* c.config.findSettingsPosition & helper
    // This was not used prior to Leo 4.5.

    /**
     * Return the position for the setting in the @settings tree for c.
     */
    public findSettingsPosition(setting: string): Position | undefined {

        const munge = g.app.config.munge;

        const root = this.settingsRoot()
        if (!root || !root.__bool__()) {
            return undefined;
        }

        setting = munge(setting)!;

        for (let p of root.subtree()) {
            //BJ munge will return None if a headstring is empty
            const h: string = p.h ? (munge(p.h)! || '') : '';
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
            if (g.match_word(p.h.trimEnd(), 0, "@settings")) {
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
    public getValFromDict(d: any, setting: string, requestedType?: string, warn = true): [any, boolean] {
        const tag = 'c.config.getValFromDict';
        const gs = d.get(g.app.config.munge(setting));
        if (!gs) {
            return [undefined, false];
        }
        // assert isinstance(gs, g.GeneralSetting), repr(gs)
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
                    `${tag}: there may be conflicting settings!`);
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
        if ((type1 && shortcuts.includes(type1)) || (type2 && shortcuts.includes(type2))) {
            g.trace('oops: type in shortcuts');
        }
        return (
            type1 === null
            || type2 === null
            || type1 === undefined
            || type2 === undefined
            || type1.startsWith('string') && !shortcuts.includes(type2)
            || type1 === 'language' && type2 === 'string'
            || type1 === 'int' && type2 === 'size'
            // added for javascript
            || type1 === 'int' && type2 === 'number'
            || type1 === 'float' && type2 === 'number'
            || (type1 in shortcuts && type2 in shortcuts)
            || type1 === type2
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
    public getBool(setting: string, defaultVal?: any): any {
        const val = this.get(setting, "bool");
        if ([true, false].includes(val)) {
            return val;
        }
        return defaultVal;
    }
    //@+node:felix.20220214191554.17: *5* c.config.getColor
    /**
     * Return the value of @color setting.
     * @param setting string name of setting
     * @returns color string
     */
    public getColor(setting: string): string {
        let col: string = this.get(setting, "color");
        while (col && col.startsWith('@')) {
            col = this.get(col.substring(1), "color");
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
    public getData(setting: string, strip_comments = true, strip_data = true): string[] {

        // 904: Add local abbreviations to global settings.
        const append: boolean = setting === 'global-abbreviations';
        let data0: string[] = [];
        if (append) {
            data0 = g.app.config.getData(setting, strip_comments, strip_data);
        }
        let data: string | string[] = this.get(setting, "data");
        // New in Leo 4.11: parser.doData strips only comments now.
        // New in Leo 4.12: parser.doData strips *nothing*.
        if ((typeof data === 'string' || data instanceof String)) {
            data = [data as string];
        }
        if (data && data.length && strip_comments) {
            // data = [z for z in data if not z.strip().startswith('#')]
            data = data.filter((z) => { !z.trim().startsWith('#') });
        }
        if (data && data.length && strip_data) {
            // data = [z.strip() for z in data if z.strip()]
            data = data.map((z) => { return z.trim(); }).filter((z) => { return !!z; });
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

        let data = this.get(setting, "outlinedata");
        if (setting === 'tree-abbreviations') {
            // 904: Append local tree abbreviations to the global abbreviations.
            const data0 = g.app.config.getOutlineData(setting);
            if (data && data0 && data !== data0) {
                console.assert(typeof data0 === 'string' || data0 instanceof String);
                console.assert(typeof data === 'string' || data instanceof String);
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
    public getDirectory(setting: string): string | undefined {
        // Fix https://bugs.launchpad.net/leo-editor/+bug/1173763
        const theDir: string = this.get(setting, 'directory');
        // TODO MAYBE CHECK???
        // if( g.os_path_exists(theDir) && g.os_path_isdir(theDir)){
        //     return theDir;
        // }
        if (theDir) {
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
        let val = this.get(setting, "float");
        try {
            val = Number(val);
            return val;
        }
        catch (TypeError) {
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
    public getFontFromParams(family: string, size: number, slant: number, weight: number, defaultSize = 12): string {
        // ? needed ?
        // family = this.get(family, "family")
        // if family in (None, ""):
        //     family = g.app.config.defaultFontFamily
        // size = this.get(size, "size")
        // if size in (None, 0):
        //     size = defaultSize
        // slant = this.get(slant, "slant")
        // if slant in (None, ""):
        //     slant = "roman"
        // weight = this.get(weight, "weight")
        // if weight in (None, ""):
        //     weight = "normal"
        // return g.app.gui.getFontFromParams(family, size, slant, weight)

        return "";
    }
    //@+node:felix.20220214191554.23: *5* c.config.getInt
    /**
     * Return the value of @int setting.
     * @param setting 
     */
    public getInt(setting: string): number | undefined {
        let val = this.get(setting, "int");
        try {
            val = Number(val);
            return val;
        }
        catch (TypeError) {
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
     * Return the value of @float setting.
     *
     * Warn if the value is less than 0.0 or greater than 1.0.
     */
    public getRatio(setting: string): any {
        let val = this.get(setting, "ratio");
        try {
            val = Number(val);
            if (0.0 <= val && val <= 1.0) {
                return val;
            }
        }
        catch (TypeError) {
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
            // assert isinstance(d, g.TypedDict), repr(d)
            const bi = d.get(setting);
            if (bi === undefined) {
                return ['unknown setting', undefined];
            }
            return [bi.path, bi.val];
        }
        //
        // lm.readGlobalSettingsFiles is opening a settings file.
        // lm.readGlobalSettingsFiles has not yet set lm.globalSettingsDict.
        // assert d is None
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
        //     assert isinstance(d, g.TypedDict), repr(d)  // was TypedDictOfLists.
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
        return this.get(setting, "string");
    }
    //@+node:felix.20220214191554.31: *4* c.config.Getters: redirect to g.app.config
    /**
     * Return a list of tuples (x,y) for common @button nodes.
     * @param setting 
     */
    public getButtons(): any {
        return g.app.config.atCommonButtonsList;  // unusual.
    }
    /**
     * Return the list of tuples (headline,script) for common @command nodes.
     * @param setting 
     */
    public getCommands(): any {
        return g.app.config.atCommonCommandsList;  // unusual.
    }
    /**
     * Return the body text of the @enabled-plugins node.
     * @param setting 
     */
    public getEnabledPlugins(): any {
        return g.app.config.enabledPluginsString;  // unusual.
    }
    /**
     * Return the list of recently opened files.
     * @param setting 
     */
    public getRecentFiles(): string[] {
        // TODO !
        // return g.app.config.getRecentFiles()  // unusual
        return [];
    }
    //@+node:felix.20220214191554.32: *4* c.config.isLocalSetting
    /**
     * Return True if the indicated setting comes from a local .leo file.
     * @param setting 
     */
    public isLocalSetting(setting: string, kind: string): boolean {
        if (!kind || ['shortcut', 'shortcuts', 'openwithtable'].includes(kind)) {
            return false;
        }
        let key = g.app.config.munge(setting);
        if (key === undefined) {
            return false;
        }
        if (!this.settingsDict) {
            return false;
        }
        let gs = this.settingsDict.get(key)
        if (!gs) {
            return false;
        }

        // assert isinstance(gs, g.GeneralSetting), repr(gs)
        let w_path: string = gs.path.toLowerCase();
        ['myLeoSettings.leo', 'leoSettings.leo'].forEach(fn => {
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
        ['leoSettings.leo', 'myLeoSettings.leo'].forEach(fn2 => {
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

        const legend = "legend:" +
            "    leoSettings.leo" +
            "@  @button, @command, @mode" +
            "[D] default settings" +
            "[F] loaded .leo File" +
            "[M] myLeoSettings.leo" +
            "[T] theme .leo file.";

        const c = this.c;

        // legend = textwrap.dedent(legend)
        let result: string[] = [];
        let name: string;
        let val: any;
        let w_c: Commands;
        let letter: any;
        for (let p_configEntry of g.app.config.config_iter(c)) {
            [name, val, w_c, letter] = p_configEntry;
            let kind = letter === ' ' ? '   ' : `[${letter}]`;
            result.push(`${kind} ${name} = ${val}\n`);
        }
        // Use a single g.es statement.
        result.push('\n' + legend)
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
    public set(p: any, kind: string, name: string, val: any, warn = true): void {

        const c = this.c;

        // Note: when kind is 'shortcut', name is a command name.
        let key: string = g.app.config.munge(name)!;
        let d = this.settingsDict;
        // assert isinstance(d, g.TypedDict), repr(d)
        let gs = d.get(key);
        if (gs) {
            // assert isinstance(gs, g.GeneralSetting), repr(gs)
            let w_path = gs.path;
            if (warn && g.os_path_finalize(c.mFileName) !== g.os_path_finalize(w_path)) {  // #1341.
                g.es("over-riding setting:", name, "from", w_path);
            }
        }

        // ? equivalent of d[key] = g.GeneralSetting(kind, path=c.mFileName, val=val, tag='setting')
        d.set(key, new g.GeneralSetting({ kind: kind, path: c.mFileName, val: val, tag: 'setting' }));

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
    public setUserSetting(setting: string, value: any): void {

        let c: Commands | undefined = this.c;

        let fn: string = g.shortFileName(c.fileName());
        let p: Position | undefined = this.findSettingsPosition(setting);

        if (!p || !p.__bool__()) {
            // c = c.openMyLeoSettings();
            // TODO !
            // ! Make command that builds outline of settings!
            // ! From the leojs vscode config settings
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
            h = h.substring(2).trim();
        }
        p.h = `${h} = ${value}`;
        console.log(`Updated '${setting}' in ${fn}`);  // #2390.
        //
        // Delay the second redraw until idle time.
        c.setChanged();
        p.setDirty();
        c.redraw_later();
    }
    //@-others

}
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
