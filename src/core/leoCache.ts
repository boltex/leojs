//@+leo-ver=5-thin
//@+node:felix.20230802145823.1: * @file src/core/leoCache.ts
/**
 * A module encapsulating Leo's file caching
 */
//@+<< leoCache imports & annotations >>
//@+node:felix.20230802145823.2: ** << leoCache imports & annotations >>
import * as vscode from 'vscode';
import * as pako from 'pako';
import * as path from 'path';
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
class CommanderCacher {
    
        public db: any;
        private _dbPath;

        constructor() {
            try{
                this._dbPath = join(g.app.homeLeoDir, 'db', 'global_data');
                this.db = new SqlitePickleShare(this._dbPath);
            }catch (e){
                this.db = {} ;
            }
        }

    //@+others
    //@+node:felix.20230802145823.4: *3* cacher.clear
    /**
     * Clear the cache for all commanders.
     */
    public clear(): void {
        // Careful: self.db may be a Python dict.
        try{
            this.db.clear();
        }catch (e){
            g.trace('unexpected exception');
            g.es_exception(e);
            this.db = {};
        }
    }
    //@+node:felix.20230802145823.5: *3* cacher.close
    public close(): void {
        // Careful: self.db may be a dict.
        if (this.db.hasOwnProperty('conn')) {
            this.db.conn.commit();
            this.db.conn.close();
        }
    }
    //@+node:felix.20230802145823.6: *3* cacher.commit
    public commit(): void {
        // Careful: self.db may be a dict.
        if (this.db.hasOwnProperty('conn')) {
            this.db.conn.commit();
        }
    }
    //@+node:felix.20230802145823.7: *3* cacher.dump
    /**
     * Dump the indicated cache if --trace-cache is in effect.
     */
    public dump() : void {
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
    public test(): boolean {

        if (g.app.gui.guiName() == 'nullGui'){
            // Null gui's don't normally set the g.app.gui.db.
            g.app.setGlobalDb();
        }

        // Fixes bug 670108.
        console.assert(!(g.app.db == null));  // a PickleShareDB instance.
        // Make sure g.guessExternalEditor works.
        g.app.db.get("LEO_EDITOR");
        // this.initFileDB('~/testpickleshare')
        const db = this.db;
        db.clear();

        assert not list(db.items());
        db['hello'] = 15;
        db['aku ankka'] = [1, 2, 313];
        db['paths/nest/ok/keyname'] = [1, (5, 46)];
        db.uncache();  // frees memory, causes re-reads later
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
    public save(c: Commands, fn: string): void {
        
        this.commit()
        if (fn){
            // 1484: Change only the key!
            
            // if( isinstance(c.db, CommanderWrapper)){
            if( c.db.constructor.name === "CommanderWrapper"){
                c.db.key = fn;
                this.commit();
            }else{
                g.trace('can not happen', c.db.__class__.__name__)
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
    
    constructor( c: Commands, fn?: string) {

        this.c = c
        this.db = g.app.db
        this.key = fn || c.mFileName
        this.user_keys:  Set<string> = new Set();
    }

    public get(key: string, default: any = None) : any {
        const value = this.db.get(`${this.key}:::${key}`);
        return  value == null  ?default: value;
    }
    public keys(): string[] {
        return Array.from(this.user_keys).sort();
    }
    public __contains__(key: any) : boolean{
        return `${this.key}:::${key}` in this.db
    }
    public __delitem__(key: any): void  {
        if( key in this.user_keys){
            this.user_keys.remove(key)
        }
        del this.db[`${this.key}:::${key}`]
    }
    public __getitem__(key: string) : any {
        return this.db[`${this.key}:::${key}`];  // May (properly) raise KeyError
    }
    public __setitem__(key: string, value: any): void {
        this.user_keys.add(key);
        this.db[`${this.key}:::${key}`] = value;
    }
}
//@+node:felix.20230802145823.12: ** class GlobalCacher
/**
 * A singleton global cacher, g.app.db
 */
class GlobalCacher {

    public db: any;

    /**
     * Ctor for the GlobalCacher class.
     */
    constructor() {
        
        const trace = g.app.debug.includes( 'cache');
        
        try{
            const w_path = join(g.app.homeLeoDir, 'db', 'g_app_db');
            if (trace){
                g.es_print('path for g.app.db:', w_path.toString());
            }
            this.db = new SqlitePickleShare(w_path)
            if( trace && !(this.db == null)){
                this.dump('Startup');
            }
        }catch (e){
            if (trace){
                g.es_exception(e);
            }
            // Use a plain dict as a dummy.
            this.db = {};
        }
    }

    //@+others
    //@+node:felix.20230802145823.13: *3* g_cacher.clear
    /**
     * Clear the global cache.
     */
    public clear(): void {
        
        // Careful: this.db may be a Python dict.
        if(g.app.debug.includes('cache')){
            g.trace('clear g.app.db');
        }
        try{
            this.db.clear();
        }except (e){
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
            
            if( g.app.debug.includes('cache')){
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
//@+node:felix.20230802145823.16: ** class PickleShareDB (unused)

/*
class PickleShareDB:
    """ The main 'connection' object for PickleShare database """
    //@+others
    //@+node:felix.20230802145823.17: *3*  Birth & special methods
    //@+node:felix.20230802145823.18: *4*  __init__ (PickleShareDB)
    def __init__(self, root: str) -> None:
        """
        Init the PickleShareDB class.
        root: The directory that contains the data. Created if it doesn't exist.
        """
        self.root: str = abspath(expanduser(root))
        if not isdir(self.root) and not g.unitTesting:
            self._makedirs(self.root)
        # Keys are normalized file names.
        # Values are tuples (obj, orig_mod_time)
        self.cache: dict[str, Any] = {}

        def loadz(fileobj: Any) -> None:
            if fileobj:
                # Retain this code for maximum compatibility.
                try:
                    val = pickle.loads(
                        zlib.decompress(fileobj.read()))
                except ValueError:
                    g.es("Unpickling error - Python 3 data accessed from Python 2?")
                    return None
                return val
            return None

        def dumpz(val: Any, fileobj: Any) -> None:
            if fileobj:
                try:
                    # Use Python 2's highest protocol, 2, if possible
                    data = pickle.dumps(val, 2)
                except Exception:
                    # Use best available if that doesn't work (unlikely)
                    data = pickle.dumps(val, pickle.HIGHEST_PROTOCOL)
                compressed = zlib.compress(data)
                fileobj.write(compressed)

        self.loader = loadz
        self.dumper = dumpz
    //@+node:felix.20230802145823.19: *4* __contains__(PickleShareDB)
    def __contains__(self, key: Any) -> bool:

        return self.has_key(key)  # NOQA
    //@+node:felix.20230802145823.20: *4* __delitem__
    def __delitem__(self, key: str) -> None:
        """ del db["key"] """
        fn = join(self.root, key)
        self.cache.pop(fn, None)
        try:
            os.remove(fn)
        except OSError:
            # notfound and permission denied are ok - we
            # lost, the other process wins the conflict
            pass
    //@+node:felix.20230802145823.21: *4* __getitem__ (PickleShareDB)
    def __getitem__(self, key: str) -> Any:
        """ db['key'] reading """
        fn = join(self.root, key)
        try:
            mtime = (os.stat(fn)[stat.ST_MTIME])
        except OSError:
            raise KeyError(key)
        if fn in self.cache and mtime == self.cache[fn][1]:
            obj = self.cache[fn][0]
            return obj
        try:
            # The cached item has expired, need to read
            obj = self.loader(self._openFile(fn, 'rb'))
        except Exception:
            raise KeyError(key)
        self.cache[fn] = (obj, mtime)
        return obj
    //@+node:felix.20230802145823.22: *4* __iter__
    def __iter__(self) -> Generator:

        for k in list(self.keys()):
            yield k
    //@+node:felix.20230802145823.23: *4* __repr__
    def __repr__(self) -> str:
        return f"PickleShareDB('{self.root}')"
    //@+node:felix.20230802145823.24: *4* __setitem__ (PickleShareDB)
    def __setitem__(self, key: str, value: Any) -> None:
        """ db['key'] = 5 """
        fn = join(self.root, key)
        parent, junk = split(fn)
        if parent and not isdir(parent):
            self._makedirs(parent)
        self.dumper(value, self._openFile(fn, 'wb'))
        try:
            mtime = os.path.getmtime(fn)
            self.cache[fn] = (value, mtime)
        except OSError as e:
            if e.errno != 2:
                raise
    //@+node:felix.20230802145823.25: *3* _makedirs
    def _makedirs(self, fn: str, mode: int = 0o777) -> None:

        os.makedirs(fn, mode)
    //@+node:felix.20230802145823.26: *3* _openFile (PickleShareDB)
    def _openFile(self, fn: str, mode: str = 'r') -> Optional[Any]:
        """ Open this file.  Return a file object.

        Do not print an error message.
        It is not an error for this to fail.
        """
        try:
            return open(fn, mode)
        except Exception:
            return None
    //@+node:felix.20230802145823.27: *3* _walkfiles & helpers
    def _walkfiles(self, s: str, pattern: str = None) -> Generator:
        """ D.walkfiles() -> iterator over files in D, recursively.

        The optional argument, pattern, limits the results to files
        with names that match the pattern.  For example,
        mydir.walkfiles('*.tmp') yields only files with the .tmp
        extension.
        """
        for child in self._listdir(s):
            if isfile(child):
                if pattern is None or self._fn_match(child, pattern):
                    yield child
            elif isdir(child):
                for f in self._walkfiles(child, pattern):
                    yield f
    //@+node:felix.20230802145823.28: *4* _listdir
    def _listdir(self, s: str, pattern: str = None) -> list[str]:
        """ D.listdir() -> List of items in this directory.

        Use D.files() or D.dirs() instead if you want a listing
        of just files or just subdirectories.

        The elements of the list are path objects.

        With the optional 'pattern' argument, this only lists
        items whose names match the given pattern.
        """
        names = os.listdir(s)
        if pattern is not None:
            names = fnmatch.filter(names, pattern)
        return [join(s, child) for child in names]
    //@+node:felix.20230802145823.29: *4* _fn_match
    def _fn_match(self, s: str, pattern: str) -> bool:
        """ Return True if self.name matches the given pattern.

        pattern - A filename pattern with wildcards, for example '*.py'.
        """
        return fnmatch.fnmatch(basename(s), pattern)
    //@+node:felix.20230802145823.30: *3* clear (PickleShareDB)
    def clear(self) -> None:
        # Deletes all files in the fcache subdirectory.
        # It would be more thorough to delete everything
        # below the root directory, but it's not necessary.
        for z in self.keys():
            self.__delitem__(z)
    //@+node:felix.20230802145823.31: *3* get
    def get(self, key: str, default: Any = None) -> Any:

        try:
            val = self[key]
            return val
        except KeyError:
            return default
    //@+node:felix.20230802145823.32: *3* has_key (PickleShareDB)
    def has_key(self, key: str) -> bool:

        try:
            self[key]
        except KeyError:
            return False
        return True
    //@+node:felix.20230802145823.33: *3* items
    def items(self) -> list[Any]:
        return [z for z in self]
    //@+node:felix.20230802145823.34: *3* keys & helpers (PickleShareDB)
    # Called by clear, and during unit testing.

    def keys(self, globpat: str = None) -> list[str]:
        """Return all keys in DB, or all keys matching a glob"""
        files: list[str]
        if globpat is None:
            files = self._walkfiles(self.root)  # type:ignore
        else:
            # Do not call g.glob_glob here.
            files = [z for z in join(self.root, globpat)]
        result = [self._normalized(s) for s in files if isfile(s)]
        return result
    //@+node:felix.20230802145823.35: *4* _normalized
    def _normalized(self, filename: str) -> str:
        """ Make a key suitable for user's eyes """
        # os.path.relpath doesn't work here.
        return self._relpathto(self.root, filename).replace('\\', '/')
    //@+node:felix.20230802145823.36: *4* _relpathto
    # Used only by _normalized.

    def _relpathto(self, src: str, dst: str) -> str:
        """ Return a relative path from self to dst.

        If there is no relative path from self to dst, for example if
        they reside on different drives in Windows, then this returns
        dst.abspath().
        """
        origin = abspath(src)
        dst = abspath(dst)
        orig_list = self._splitall(normcase(origin))
        # Don't normcase dst!  We want to preserve the case.
        dest_list = self._splitall(dst)
        if orig_list[0] != normcase(dest_list[0]):
            # Can't get here from there.
            return dst
        # Find the location where the two paths start to differ.
        i = 0
        for start_seg, dest_seg in zip(orig_list, dest_list):
            if start_seg != normcase(dest_seg):
                break
            i += 1
        # Now i is the point where the two paths diverge.
        # Need a certain number of "os.pardir"s to work up
        # from the origin to the point of divergence.
        segments = [os.pardir] * (len(orig_list) - i)
        # Need to add the diverging part of dest_list.
        segments += dest_list[i:]
        if segments:
            return join(*segments)
        # If they happen to be identical, use os.curdir.
        return os.curdir
    //@+node:felix.20230802145823.37: *4* _splitall
    # Used by relpathto.

    def _splitall(self, s: str) -> list[str]:
        """ Return a list of the path components in this path.

        The first item in the list will be a path.  Its value will be
        either os.curdir, os.pardir, empty, or the root directory of
        this path (for example, '/' or 'C:\\').  The other items in
        the list will be strings.

        path.path.joinpath(*result) will yield the original path.
        """
        parts = []
        loc = s
        while loc != os.curdir and loc != os.pardir:
            prev = loc
            loc, child = split(prev)
            if loc == prev:
                break
            parts.append(child)
        parts.append(loc)
        parts.reverse()
        return parts
    //@+node:felix.20230802145823.38: *3* uncache
    def uncache(self, *items: Any) -> None:
        """ Removes all, or specified items from cache

        Use this after reading a large amount of large objects
        to free up memory, when you won't be needing the objects
        for a while.

        """
        if not items:
            self.cache = {}
        for it in items:
            self.cache.pop(it, None)
    //@-others
*/
//@+node:felix.20230802145823.39: ** class SqlitePickleShare
/**
 * The main 'connection' object for SqlitePickleShare database
 */
class SqlitePickleShare {
    
    public root: string;

    //@+others
    //@+node:felix.20230802145823.40: *3*  Birth & special methods
    public init_dbtables(conn: any): void {
        const sql = 'create table if not exists cachevalues(key text primary key, data blob);';
        conn.execute(sql);
    }
    //@+node:felix.20230802145823.41: *4*  __init__ (SqlitePickleShare)
    /**
     * Init the SqlitePickleShare class.
     * root: The directory that contains the data. Created if it doesn't exist.
     */
    constructor(root: string) {

        this.root = abspath(expanduser(root))
        
        if !isdir(this.root) and not g.unitTesting:
            this._makedirs(this.root)

        dbfile = ':memory:' if g.unitTesting else join(root, 'cache.sqlite')
        this.conn = sqlite3.connect(dbfile, isolation_level=None)
        this.init_dbtables(this.conn)

        // Keys are normalized file names.
        // Values are tuples (obj, orig_mod_time)
        this.cache: dict[str, Any] = {}

        this.reset_protocol_in_values()

    }
    //@+node:felix.20230802145823.42: *4* __contains__(SqlitePickleShare)
    def __contains__(self, key: str) -> bool:

        return self.has_key(key)  # NOQA
    //@+node:felix.20230802145823.43: *4* __delitem__
    def __delitem__(self, key: str) -> None:
        """ del db["key"] """
        try:
            self.conn.execute(
                '''delete from cachevalues
                where key=?''', (key,))
        except sqlite3.OperationalError:
            pass
    //@+node:felix.20230802145823.44: *4* __getitem__
    def __getitem__(self, key: str) -> None:
        """ db['key'] reading """
        try:
            obj = None
            for row in self.conn.execute(
                '''select data from cachevalues
                where key=?''', (key,)):
                obj = self.loader(row[0])
                break
            else:
                raise KeyError(key)
        except sqlite3.Error:
            raise KeyError(key)
        return obj
    //@+node:felix.20230802145823.45: *4* __iter__
    def __iter__(self) -> Generator:

        for k in list(self.keys()):
            yield k
    //@+node:felix.20230802145823.46: *4* __repr__
    def __repr__(self) -> str:
        return f"SqlitePickleShare('{self.root}')"
    //@+node:felix.20230802145823.47: *4* __setitem__
    def __setitem__(self, key: str, value: Any) -> None:
        """ db['key'] = 5 """
        try:
            data = self.dumper(value)
            self.conn.execute(
                '''replace into cachevalues(key, data) values(?,?);''',
                (key, data))
        except sqlite3.OperationalError:
            g.es_exception()
    //@+node:felix.20230804140347.1: *3* loader
    private loader(data: any): any {
        if data:
            // Retain this code for maximum compatibility.
            try:
                val = pickle.loads(zlib.decompress(data))
            except(ValueError, TypeError):
                g.es("Unpickling error - Python 3 data accessed from Python 2?")
                return None
            return val
        return None
    }
    //@+node:felix.20230804140352.1: *3* dumper
    private dumper(): any {
        try:
            // Use Python 2's highest protocol, 2, if possible
            data = pickle.dumps(val, protocol=2)
        except Exception:
            // Use best available if that doesn't work (unlikely)
            data = pickle.dumps(val, pickle.HIGHEST_PROTOCOL)
    }
    //@+node:felix.20230802145823.48: *3* _makedirs
    def _makedirs(self, fn: str, mode: int = 0o777) -> None:

        os.makedirs(fn, mode)
    //@+node:felix.20230802145823.49: *3* _openFile (SqlitePickleShare)
    def _openFile(self, fn: str, mode: str = 'r') -> Optional[Any]:
        """ Open this file.  Return a file object.

        Do not print an error message.
        It is not an error for this to fail.
        """
        try:
            return open(fn, mode)
        except Exception:
            return None
    //@+node:felix.20230802145823.50: *3* _walkfiles & helpers
    def _walkfiles(self, s: str, pattern: str = None) -> None:
        """ D.walkfiles() -> iterator over files in D, recursively.

        The optional argument, pattern, limits the results to files
        with names that match the pattern.  For example,
        mydir.walkfiles('*.tmp') yields only files with the .tmp
        extension.
        """
    //@+node:felix.20230802145823.51: *4* _listdir
    def _listdir(self, s: str, pattern: str = None) -> list[str]:
        """ D.listdir() -> List of items in this directory.

        Use D.files() or D.dirs() instead if you want a listing
        of just files or just subdirectories.

        The elements of the list are path objects.

        With the optional 'pattern' argument, this only lists
        items whose names match the given pattern.
        """
        names = os.listdir(s)
        if pattern is not None:
            names = fnmatch.filter(names, pattern)
        return [join(s, child) for child in names]
    //@+node:felix.20230802145823.52: *4* _fn_match
    def _fn_match(self, s: str, pattern: Any) -> bool:
        """ Return True if self.name matches the given pattern.

        pattern - A filename pattern with wildcards, for example '*.py'.
        """
        return fnmatch.fnmatch(basename(s), pattern)
    //@+node:felix.20230802145823.53: *3* clear (SqlitePickleShare)
    def clear(self) -> None:
        # Deletes all files in the fcache subdirectory.
        # It would be more thorough to delete everything
        # below the root directory, but it's not necessary.
        self.conn.execute('delete from cachevalues;')
    //@+node:felix.20230802145823.54: *3* get  (SqlitePickleShare)
    def get(self, key: str, default: Any = None) -> Any:

        if not self.has_key(key):  # noqa
            return default
        try:
            val = self[key]
            return val
        except Exception:  // #1444: Was KeyError.
            return default
    //@+node:felix.20230802145823.55: *3* has_key (SqlightPickleShare)
    def has_key(self, key: str) -> bool:
        sql = 'select 1 from cachevalues where key=?;'
        for _row in self.conn.execute(sql, (key,)):
            return True
        return False
    //@+node:felix.20230802145823.56: *3* items
    def items(self) -> Generator:
        sql = 'select key,data from cachevalues;'
        for key, data in self.conn.execute(sql):
            yield key, data
    //@+node:felix.20230802145823.57: *3* keys
    # Called by clear, and during unit testing.

    def keys(self, globpat: str = None) -> Generator:
        """Return all keys in DB, or all keys matching a glob"""
        if globpat is None:
            sql = 'select key from cachevalues;'
            args: Sequence[Any] = tuple()
        else:
            sql = "select key from cachevalues where key glob ?;"
            # pylint: disable=trailing-comma-tuple
            args = globpat,
        for key in self.conn.execute(sql, args):
            yield key
    //@+node:felix.20230802145823.58: *3* reset_protocol_in_values
    def reset_protocol_in_values(self) -> None:
        PROTOCOLKEY = '__cache_pickle_protocol__'
        if self.get(PROTOCOLKEY, 3) == 2:
            return
        //@+others
        //@+node:felix.20230802145823.59: *4* viewrendered special case
        import json
        row = self.get('viewrendered_default_layouts') or (None, None)
        row = json.loads(json.dumps(row[0])), json.loads(json.dumps(row[1]))
        self['viewrendered_default_layouts'] = row
        //@+node:felix.20230802145823.60: *4* do_block
        def do_block(cur: Any) -> Any:
            itms = tuple((self.dumper(self.loader(v)), k) for k, v in cur)
            if itms:
                self.conn.executemany('update cachevalues set data=? where key=?', itms)
                self.conn.commit()
                return itms[-1][1]
            return None
        //@-others
        self.conn.isolation_level = 'DEFERRED'

        sql0 = '''select key, data from cachevalues order by key limit 50'''
        sql1 = '''select key, data from cachevalues where key > ? order by key limit 50'''


        block = self.conn.execute(sql0)
        lk = do_block(block)
        while lk:
            lk = do_block(self.conn.execute(sql1, (lk,)))
        self[PROTOCOLKEY] = 2
        self.conn.commit()

        self.conn.isolation_level = None
    //@+node:felix.20230802145823.61: *3* uncache
    def uncache(self, *items: Any) -> None:
        """not used in SqlitePickleShare"""
        pass
    //@-others

}
//@+node:felix.20230802145823.62: ** function: dump_cache
/**
 * Dump the given cache. 
 */
function dump_cache(db: any, tag: string): void {
    
    g.es_print(`\n===== ${tag} =====\n`)
    if (db == null) {
        g.es_print('db is None!');
        return;
    }
    // Create a dict, sorted by file prefixes.
    const d: Record<string, any> = {};
    for key in db.keys():
        key = key[0]
        val = db.get(key)
        data = key.split(':::')
        if len(data) == 2
            fn, key2 = data
        else
            fn, key2 = 'None', key

        aList = d.get(fn, [])
        aList.append((key2, val),)
        d[fn] = aList

    // Print the dict.
    files = 0;
    for key in sorted(d.keys())
        if key != 'None'
            dump_list('File: ' + key, d.get(key))
            files += 1


    if d.get('None')
        heading = f"All others ({tag})" if files else None
        dump_list(heading, d.get('None'))


}
function dump_list(heading: any, aList: [string, any][]): void {
    if (heading){
        g.es_print(f'\n{heading}...\n')
    }
    for (const aTuple of aList){
        let [key, val] = aTuple
        if (isinstance(val, str)){
            if( key.startswith('windowState')){
                g.es_print(key)
            }else if( key.endswith(('leo_expanded', 'leo_marked'))){
                if (val){
                    g.es_print(f"{key:30}:")
                    g.printObj(val.split(','))
                }else{
                    g.es_print(f"{key:30}: []")
                }

            }else{
                g.es_print(f"{key:30}: {val}")
            }

        }else if (isinstance(val, (int, float))){
            g.es_print(f"{key:30}: {val}")
        }else{
            g.es_print(f"{key:30}:")
            g.printObj(val)
        }

    }
}
//@-others
//@@language typescript
//@@tabwidth -4
//@@pagewidth 70
//@-leo
