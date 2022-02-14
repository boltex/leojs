//@+leo-ver=5-thin
//@+node:felix.20211031230132.1: * @file src/core/leoConfig.ts
//@+<< imports >>
//@+node:felix.20211031230614.1: ** << imports >>
import { Commands } from './leoCommands';
import * as g from './leoGlobals';

//@-<< imports >>
//@+others
//@+node:felix.20211031230501.1: ** class LocalConfigManager
/**
 * A class to hold config settings for commanders.
 */
export class LocalConfigManager {

    public c: Commands;
    public settingsDict: { [key: string]: any };

    // TODO : REPLACE WITH REAL TRANSLATION FROM LEO
    public default_derived_file_encoding: string = "utf-8";
    public default_at_auto_file_encoding: string = "utf-8";
    public new_leo_file_encoding: string = "UTF-8";
    public save_clears_undo_buffer: boolean = false;

    //@+others
    //@+node:felix.20211031231935.1: *3* constructor

    constructor(c: Commands) {
        this.c = c;
        this.settingsDict = {};

        // TODO : TEMP stub settings

        this.settingsDict['insert-new-nodes-at-end'] = false;
        this.settingsDict['max-undo-stack-size'] = 0;
        this.settingsDict['undo-granularity'] = 'line';

    }

    //@+node:felix.20211031234043.1: *3* get
    /**
     * Get the setting and make sure its type matches the expected type.
     */
    public get(setting: string): any {
        return this.settingsDict[setting];
    }
    //@+node:felix.20211031234046.1: *3* getInt
    public getInt(setting: string): any {
        return this.get(setting);
    }
    //@+node:felix.20211031234049.1: *3* getBool
    public getBool(setting: string): any {
        return this.get(setting);
    }
    //@+node:felix.20211031234059.1: *3* getString
    public getString(setting: string): any {
        return this.get(setting);
    }
    //@-others
}
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

        if (g.app.loadedThemes) {
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
                    val = c.config.get(key);
                } else {
                    val = this.get(key, kind);  // Don't use bunch.val!
                }
                if (c) {
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
    /* def getBool(self, setting, default=None):
        """Return the value of @bool setting, or the default if the setting is not found."""
        val = self.get(setting, "bool")
        if val in (True, False):
            return val
        return default
     */
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
    /* def getData(self, setting, strip_comments=True, strip_data=True):
        """Return a list of non-comment strings in the body text of @data setting."""
        data = self.get(setting, "data") or []
        # New in Leo 4.12.1: add two keyword arguments, with legacy defaults.
        if data and strip_comments:
            data = [z for z in data if not z.strip().startswith('#')]
        if data and strip_data:
            data = [z.strip() for z in data if z.strip()]
        return data

    def getOutlineData(self, setting):
        """Return the pastable (xml text) of the entire @outline-data tree."""
        return self.get(setting, "outlinedata")
     */
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
    /* def config_iter(self, c):
        """Letters:
          leoSettings.leo
        D default settings
        F loaded .leo File
        M myLeoSettings.leo
        @ @button, @command, @mode.
        """
        lm = g.app.loadManager
        d = c.config.settingsDict if c else lm.globalSettingsDict
        limit = c.config.getInt('print-settings-at-data-limit')
        if limit is None:
            limit = 20  # A resonable default.
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
//@-others
//@@language typescript
//@@tabwidth -4
//@-leo
