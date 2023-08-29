//@+leo-ver=5-thin
//@+node:felix.20230802145823.1: * @file src/core/leoCache.ts
/**
 * A module encapsulating Leo's file caching
 */
//@+<< leoCache imports & annotations >>
//@+node:felix.20230802145823.2: ** << leoCache imports & annotations >>
import * as vscode from 'vscode';
import * as path from 'path';
import * as pako from 'pako';
import { Database, SqlJsStatic } from 'sql.js';
import * as g from './leoGlobals';
import { Commands } from './leoCommands';

var pickle = require('./jpicklejs');

//@-<< leoCache imports & annotations >>

// Abbreviations used throughout.
const abspath = g.os_path_abspath;
const basename = g.os_path_basename;
const expanduser = g.os_path_expanduser;
const isdir = g.os_path_isdir;
const isfile = g.os_path_isfile;
const join = g.os_path_join;
const normcase = g.os_path_normcase;
const split = g.os_path_split;

//@+others
//@+node:felix.20230802145823.3: ** class CommanderCacher
/**
 * A class to manage per-commander caches.
 */
export class CommanderCacher {

    public db: SqlitePickleShare;

    constructor() {
        try {
            const w_path = join(g.app.homeLeoDir, 'db', 'global_data');
            this.db = new SqlitePickleShare(w_path);
        } catch (e) {
            // @ts-expect-error
            this.db = {};
        }
    }

    //@+others
    //@+node:felix.20230806001339.1: *3* cacher.init
    public init(): Promise<unknown> {
        //
        return this.db.init;
    }
    //@+node:felix.20230802145823.4: *3* cacher.clear
    /**
     * Clear the cache for all commanders.
     */
    public clear(): void {
        // Careful: self.db may be a Python dict.
        try {
            this.db.clear();
        } catch (e) {
            g.trace('unexpected exception');
            g.es_exception(e);
            // @ts-expect-error
            this.db = {};
        }
    }
    //@+node:felix.20230802145823.5: *3* cacher.close
    public async close(): Promise<void> {
        // Careful: self.db may be a dict.
        if (this.db.hasOwnProperty('conn')) {
            await this.db.commit();
            this.db.conn!.close();
        }
    }
    //@+node:felix.20230802145823.6: *3* cacher.commit
    public async commit(): Promise<void> {
        // Careful: self.db may be a dict.
        if (this.db.hasOwnProperty('conn')) {
            await this.db.commit();
        }
    }
    //@+node:felix.20230802145823.7: *3* cacher.dump
    /**
     * Dump the indicated cache if --trace-cache is in effect.
     */
    public dump(): void {
        dump_cache(g.app.commander_db, 'Commander Cache');
    }
    //@+node:felix.20230802145823.8: *3* cacher.get_wrapper
    /**
     * Return a new wrapper for c.
     */
    public get_wrapper(c: Commands, fn?: string): CommanderWrapper {
        return new CommanderWrapper(c, fn);
    }
    //@+node:felix.20230802145823.9: *3* cacher.test
    public async test(): Promise<boolean> {

        if (g.app.gui.guiName() === 'nullGui') {
            // Null gui's don't normally set the g.app.gui.db.
            await g.app.setGlobalDb();
        }

        // Fixes bug 670108.
        console.assert(!(g.app.db == null));  // a PickleShareDB instance.
        // Make sure g.guessExternalEditor works.
        g.app.db["LEO_EDITOR"];
        // this.initFileDB('~/testpickleshare')
        const db = this.db;
        db.clear();

        console.assert(![...db.items()].length);

        // db in prigrams to be used as 'any'
        db['hello'] = 15;
        db['aku ankka'] = [1, 2, 313];
        db['paths/nest/ok/keyname'] = [1, [5, 46]];

        // print(db.keys())

        db.clear();
        return true;

    }
    //@+node:felix.20230802145823.10: *3* cacher.save
    /**
     * Save the per-commander cache.

        Change the cache prefix if changeName is True.

        save and save-as set changeName to True, save-to does not.
     */
    public async save(c: Commands, fn: string): Promise<void> {

        await this.commit();
        if (fn) {
            // 1484: Change only the key!

            // if( isinstance(c.db, CommanderWrapper)){
            if (c.db.constructor.name === "CommanderWrapper") {
                c.db.key = fn;
                await this.commit();
            } else {
                g.trace('can not happen', c.db.__class__.__name__);
            }
        }
    }
    //@-others

}
//@+node:felix.20230802145823.11: ** class CommanderWrapper
/** 
 * A class to distinguish keys from separate commanders.
 */
class CommanderWrapper {

    private c: Commands;
    private db: any; // SqlitePickleShare
    private key: string;
    private user_keys: Set<string>;

    constructor(c: Commands, fn?: string) {

        this.c = c;
        this.db = g.app.db;
        this.key = fn || c.mFileName;
        this.user_keys = new Set();
        return new Proxy(this, this);

    }

    public keys(): string[] {
        return Array.from(this.user_keys).sort();
    }

    public has(target: CommanderWrapper, prop: string) {
        return `${this.key}:::${prop}` in this.db;
    }

    public deleteProperty(target: CommanderWrapper, prop: string): boolean {
        if (this.user_keys.has(prop)) {
            this.user_keys.delete(prop);
        }
        delete this.db[`${this.key}:::${prop}`];
        return true;

    }

    public get(target: CommanderWrapper, prop: string): any {
        if (prop === "keys") {
            return this.keys.bind(target);
        }
        if (prop === "toString") {
            return this.toString.bind(target);
        }
        if (prop === 'valueOf') {
            return this.valueOf.bind(target);
        }
        if (prop === "Symbol(Symbol.iterator)") {
            return this[Symbol.iterator].bind(target);
        }
        return this.db[`${this.key}:::${prop}`];  // May (properly) raise KeyError
    }

    public set(target: CommanderWrapper, prop: string, value: any): boolean {
        this.user_keys.add(prop);
        this.db[`${this.key}:::${prop}`] = value;
        return true;
    }

    valueOf() {
        return 'CommanderWrapper: ' + this.key + JSON.stringify(this.user_keys);
    }
    toString() {
        return 'CommanderWrapper: ' + this.key + JSON.stringify(this.user_keys);
    }

    *[Symbol.iterator]() {
        for (const key of this.user_keys) {
            yield [key, this.db[`${this.key}:::${key}`]];
        }
    }

}
//@+node:felix.20230802145823.12: ** class GlobalCacher
/**
 * A singleton global cacher, g.app.db
 */
export class GlobalCacher {

    public db: any;

    /**
     * Ctor for the GlobalCacher class.
     */
    constructor() {

        const trace = g.app.debug.includes('cache');

        try {
            const w_path = join(g.app.homeLeoDir, 'db', 'g_app_db');
            if (trace) {
                g.es_print('path for g.app.db:', w_path.toString());
            }
            this.db = new SqlitePickleShare(w_path);
            if (trace && !(this.db == null)) {
                this.dump('Startup');
            }
        } catch (e) {
            if (trace) {
                g.es_exception(e);
            }
            // Use a plain dict as a dummy.
            this.db = {};
        }
    }

    //@+others
    //@+node:felix.20230806001555.1: *3* g_cacher.init
    public init(): Promise<unknown> {
        //
        return this.db.init();
    }
    //@+node:felix.20230802145823.13: *3* g_cacher.clear
    /**
     * Clear the global cache.
     */
    public clear(): void {

        // Careful: this.db may be a Python dict.
        if (g.app.debug.includes('cache')) {
            g.trace('clear g.app.db');
        }
        try {
            this.db.clear();
        } catch (e) {
            // this.db.clear();
            // except Exception
            g.trace('unexpected exception');
            g.es_exception(e);
            this.db = {};
        }

    }
    //@+node:felix.20230802145823.14: *3* g_cacher.commit_and_close()
    public commit_and_close(): void {
        // Careful: this.db may be a dict.

        if (this.db.hasOwnProperty('conn')) {

            if (g.app.debug.includes('cache')) {
                this.dump('Shutdown');
            }
            this.db.conn.commit();
            this.db.conn.close();
        }
    }
    //@+node:felix.20230802145823.15: *3* g_cacher.dump
    /**
     * Dump the indicated cache if --trace-cache is in effect.
     */
    public dump(tag = ''): void {
        const tag0 = 'Global Cache';
        const tag2 = tag ? `${tag0}: ${tag}` : tag0;
        dump_cache(this.db, tag2);  // Careful: g.app.db may not be set yet.
    }
    //@-others

}
//@+node:felix.20230802145823.39: ** class SqlitePickleShare
/**
 * The main 'connection' object for SqlitePickleShare database
 */
class SqlitePickleShare {

    public root: string;
    public conn: Database | undefined;
    public init: Promise<Database>;
    public cache: Record<string, any>;

    // Allow index signature to allow any arbitrary property
    [key: string]: any;

    //@+others
    //@+node:felix.20230802145823.40: *3*  Birth & special methods
    //@+node:felix.20230802145823.41: *4*  __init__ (SqlitePickleShare)
    /**
     * Init the SqlitePickleShare class.
     *
     * root: The directory that contains the data. Created if it doesn't exist.
     *
     * Proxy setup for equivalent of Python's dunder method overrides
     * 
     */
    constructor(root: string) {

        this.root = abspath(expanduser(root));
        // Keys are normalized file names.
        // Values are tuples (obj, orig_mod_time)
        this.cache = {};

        // 'init' can be used to know if ready, it return a database once done. 
        this.init = new Promise((resolve, reject) => {

            void (async () => {
                try {
                    const w_isdir = await isdir(this.root);
                    if (!w_isdir && !g.unitTesting) {
                        await this._makedirs(this.root);
                    }

                    const dbfile = join(root, 'cache.sqlite');
                    if (g.unitTesting) {
                        // TODO : GET FILE
                        // this.conn = await sqlite3.connect(dbfile);
                        const filebuffer = await vscode.workspace.fs.readFile(
                            g.makeVscodeUri(path.join(this.root))
                            // vscode.Uri.joinPath(p_context.extensionUri, 'test1.db')
                        );
                        this.conn = new g.SQL.Database(filebuffer);
                    } else {
                        this.conn = new g.SQL.Database();
                    }

                    // LEOJS: replaced function & call.
                    // USED TO BE : this.init_dbtables(this.conn)
                    const sql = 'create table if not exists cachevalues(key text primary key, data blob);';
                    this.conn.exec(sql);

                    await this.reset_protocol_in_values();
                    resolve(this.conn);
                } catch (e) {
                    reject('LEOJS: SqlitePickleShare failed init');
                }

            })();

        });

        return new Proxy(this, {
            get(target, prop) {
                prop = prop.toString();
                // ALSO SUPPORT : toString, valueOf, iterator
                if (prop === "toString") {
                    return target.__repr__.bind(target);
                }
                if (prop === 'valueOf') {
                    return target.__repr__.bind(target);
                }
                if (prop === "Symbol(Symbol.iterator)") {
                    return target.__iter__.bind(target);
                }
                // Methods to allow through
                if (prop === "get") {
                    return target.get.bind(target);
                }
                if (prop === "clear") {
                    return target.clear.bind(target);
                }
                if (prop === "has_key") {
                    return target.has_key.bind(target);
                }
                // Properties to allow through
                if (prop === "init") {
                    return target.init;
                }
                if (prop === "conn") {
                    return target.conn;
                }
                // OVERRIDDEN USAGE WITH SQLITE
                return target.__getitem__(prop);
            },
            set(target, prop, value) {
                target.__setitem__(prop.toString(), value);
                return true;
            },
            deleteProperty(target, prop) {
                target.__delitem__(prop.toString());
                return true;
            },
            has(target, prop) {
                return target.__contains__(prop.toString());
            },
        });

    }
    //@+node:felix.20230802145823.42: *4* __contains__(SqlitePickleShare)
    public __contains__(key: string): boolean {

        return this.has_key(key);  // NOQA

    }
    //@+node:felix.20230802145823.43: *4* __delitem__
    /**
     * del db["key"] 
     */
    public __delitem__(key: string): void {

        try {
            if (this.conn) {
                this.conn.exec('delete from cachevalues where key=?', [key]);
            }
        } catch (e) {
            // pass
        }
    }
    //@+node:felix.20230802145823.44: *4* __getitem__
    /**
     *  db['key'] reading 
     */
    public __getitem__(key: string): any {
        let obj = undefined;
        let w_found = false;
        if (this.conn) {

            try {
                for (const row of this.conn.exec('select data from cachevalues where key=?', [key])) {

                    // TODO : CHECK IF row.values[0] is OK !!
                    // TODO : maybe use this instead: row.values[0][0]
                    obj = this.loader(row.values[0][0] as Uint8Array);

                    w_found = true;
                    break;
                }
                if (!w_found) {
                    throw new Error("No such property exists");
                }
            } catch (e) {
                throw new Error("No such property exists");
            }
        }
        return obj;
    }
    //@+node:felix.20230802145823.45: *4* __iter__
    public *__iter__(): Generator<string> {

        for (const k of [...this.keys()]) {
            yield k;
        }
    }
    //@+node:felix.20230802145823.46: *4* __repr__
    public __repr__(): string {
        return `SqlitePickleShare('${this.root}')`;
    }
    //@+node:felix.20230802145823.47: *4* __setitem__
    /**
     *  db['key'] = 5
     */
    public __setitem__(key: string, value: any): void {

        try {
            const data = this.dumper(value);
            if (this.conn) {
                this.conn.exec(
                    'replace into cachevalues(key, data) values(?,?);',
                    [key, data]
                );
            }
        } catch (e) {
            g.es_exception(e);
        }

    }
    //@+node:felix.20230807231629.1: *3* commit
    public async commit(): Promise<void> {
        if (this.conn) {
            const db_data = this.conn.export();
            const db_buffer = Buffer.from(db_data);
            const db_fileName = path.join(this.root);
            const db_uri = g.makeVscodeUri(db_fileName);
            await vscode.workspace.fs.writeFile(db_uri, db_buffer);
        }
        return;
    }
    //@+node:felix.20230804140347.1: *3* loader
    /**
     * REBUILDS an object
     */
    private loader(data: Uint8Array): any {
        if (data !== null && data !== undefined) {
            let val;
            // Retain this code for maximum compatibility.
            try {
                val = pickle.loads(pako.inflate(data));
            } catch (e) {
                g.es("Unpickling error - Python 3 data accessed from Python 2?");
                return undefined;
            }
            return val;
        }

        return undefined;

    }
    //@+node:felix.20230804140352.1: *3* dumper
    /**
     * Takes an object, pickles it, then returns the gzipped Uint8Array 
     */
    private dumper(val: any): Uint8Array {
        let data;
        try {
            // Use Python 2's highest protocol, 2, if possible
            data = pickle.dumps(val, 2);
        } catch (e) {
            // Use best available if that doesn't work (unlikely)
            data = pickle.dumps(val, pickle.HIGHEST_PROTOCOL);
        }
        // TODO : Test this !
        // return sqlite3.Binary(zlib.compress(data));
        return pako.deflate(data);
    }
    //@+node:felix.20230802145823.48: *3* _makedirs
    public async _makedirs(fn: string, mode: number = 0o777): Promise<void> {

        await g.mkdir(fn);

    }
    //@+node:felix.20230802145823.53: *3* clear (SqlitePickleShare)
    public clear(): void {

        // TODO : Fix this docstring !

        // Deletes all files in the fcache subdirectory.
        // It would be more thorough to delete everything
        // below the root directory, but it's not necessary.
        this.conn!.exec('delete from cachevalues;');
    }
    //@+node:felix.20230802145823.54: *3* get  (SqlitePickleShare)
    public get(key: string, p_default?: any): any {

        if (!this.has_key(key)) {
            return p_default;
        }
        try {
            const val = this.__getitem__(key);
            return val;
        } catch (e) {  // #1444: Was KeyError.
            return p_default;
        }

    }
    //@+node:felix.20230802145823.55: *3* has_key (SqlitePickleShare)
    public has_key(key: string): boolean {
        const sql = 'select 1 from cachevalues where key=?;';
        for (const _row of this.conn!.exec(sql, [key])) {
            return true;
        }
        return false;

    }
    //@+node:felix.20230802145823.56: *3* items
    public *items(): Generator<[string, any]> {
        const sql = 'select key,data from cachevalues;';
        for (const res of this.conn!.exec(sql)) {
            yield [res.values[0][0] as string, res.values[0][1]];
        }
    }
    //@+node:felix.20230802145823.57: *3* keys
    // Called by clear, and during unit testing.

    /**
     * Return all keys in DB, or all keys matching a glob
     */
    public *keys(globpat?: string): Generator<string> {

        let sql: string;
        let args: any[];

        if (globpat == null) {
            sql = 'select key from cachevalues;';
            args = [];
        } else {
            sql = "select key from cachevalues where key glob ?;";
            args = [globpat];
        }

        for (const key of this.conn!.exec(sql, args)) {
            yield key.values[0][0] as string;
        }
    }
    //@+node:felix.20230802145823.58: *3* reset_protocol_in_values
    public async reset_protocol_in_values(): Promise<void> {

        const PROTOCOLKEY = '__cache_pickle_protocol__';

        if (this.get(PROTOCOLKEY, 3) === 2) {
            return;
        }

        //@+others
        //@+node:felix.20230802145823.59: *4* viewrendered special case

        const row_a = this.get('viewrendered_default_layouts') || [undefined, undefined];
        const row_o = [JSON.parse(JSON.stringify(row_a[0])), JSON.parse(JSON.stringify(row_a[1]))];

        this.__setitem__('viewrendered_default_layouts', row_o);
        //@+node:felix.20230802145823.60: *4* do_block
        const do_block = (cur: any[]): any => {
            // itms = tuple((self.dumper(self.loader(v)), k) for k, v in cur)
            const itms: Array<[any, string]> = cur.map(([k, v]) => [this.dumper(this.loader(v)), k]);

            if (itms && itms.length) {
                for (const itm of itms) {

                    this.conn!.exec('update cachevalues set data=? where key=?', itm);
                }
                // await this.commit(); // ! LEOJS : COMMIT AT END OF reset_protocol_in_values
                return itms[itms.length - 1][1];
            }

            return undefined;

        };

        //@-others

        // Unused in leojs
        // this.conn.isolation_level = 'DEFERRED';

        const sql0 = 'select key, data from cachevalues order by key limit 50';
        const sql1 = 'select key, data from cachevalues where key > ? order by key limit 50';

        const block = this.conn!.exec(sql0);
        let lk = do_block(block[0].values);

        while (lk !== undefined) {
            lk = do_block(this.conn!.exec(sql1, [lk]));
        }

        this.__setitem__(PROTOCOLKEY, 2);
        await this.commit();

        // Unused in leojs
        // this.conn.isolation_level = None;

    }
    //@+node:felix.20230802145823.61: *3* uncache
    /**
     * not used in SqlitePickleShare
     */
    public uncache(items: any): void {

        // pass

    }
    //@-others

}
//@+node:felix.20230802145823.62: ** function: dump_cache
/**
 * Dump the given cache. 
 */
function dump_cache(db: any, tag: string): void {

    g.es_print(`\n===== ${tag} =====\n`);
    if (db == null) {
        g.es_print('db is None!');
        return;
    }
    // Create a dict, sorted by file prefixes.
    const d: Record<string, any> = {};
    for (const x_key of db.keys()) {
        const key = x_key[0];
        const val = db.get(key);
        const data = key.split(':::');
        let fn;
        let key2;
        if (data.length === 2) {
            [fn, key2] = data;
        } else {
            [fn, key2] = ['None', key];
        }
        const aList = d.get(fn, []);
        aList.push([key2, val]);
        d[fn] = aList;

    }
    // Print the dict.
    let files = 0;
    for (const key of [...d.keys()].sort()) {
        if (key !== 'None') {
            dump_list('File: ' + key, d.get(key));
            files += 1;
        }
    }
    const d_none = d.get('None');
    if (d_none && d_none.length) {
        const heading = files ? `All others (${tag})` : '';
        dump_list(heading, d_none);
    }

}

function dump_list(heading: string, aList: [string, any][]): void {
    if (heading) {
        g.es_print(`\n${heading}...\n`);
    }
    for (const aTuple of aList) {
        let [key, val] = aTuple;
        if (typeof val === 'string') {
            if (key.startsWith('windowState')) {
                g.es_print(key);
            } else if (key.endsWith('leo_expanded') || key.endsWith('leo_marked')) {
                if (val) {
                    g.es_print(`${key.toString().padEnd(30)}:`);
                    g.printObj(val.split(','));
                } else {
                    g.es_print(`${key.toString().padEnd(30)}: []`);
                }
            } else {
                g.es_print(`${key.toString().padEnd(30)}: ${val}`);
            }
        } else if (typeof val === 'number') {
            g.es_print(`${key.toString().padEnd(30)}: ${val}`);
        } else {
            g.es_print(`${key.toString().padEnd(30)}:`);
            g.printObj(val);
        }

    }
}
//@-others
//@@language typescript
//@@tabwidth -4
//@@pagewidth 70
//@-leo
