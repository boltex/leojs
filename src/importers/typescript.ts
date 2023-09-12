//@+leo-ver=5-thin
//@+node:felix.20230911234728.1: * @file src/importers/typescript.ts
/** 
 * The @auto importer for TypeScript.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230911234728.2: ** class TS_Importer(Importer)
class TS_Importer extends Importer {

    public language: string = 'typescript';


    //@+<< define non-function patterns >>
    //@+node:felix.20230911234728.3: *3* << define non-function patterns >>
    public non_function_patterns: RegExp[] = [
        /catch\s*\(.*\)/,
        // Add other non-function patterns as needed
    ];
    //@-<< define non-function patterns >>
    //@+<< define function patterns >>
    //@+node:felix.20230911234728.4: *3* << define function patterns >>
    // The pattern table. Order matters!
    public function_patterns: [number, RegExp][] = [
        [1, /(interface\s+\w+)/], // interface name
        [1, /(class\s+\w+)/], // class name
        [1, /export\s+(class\s+\w+)/], // export class name
        [1, /export\s+enum\s+(\w+)/], // enum name
        [1, /export\s+const\s+enum\s+(\w+)/], // const enum name
        [1, /export\s+function\s+(\w+)/], // export function name
        [1, /export\s+interface\s+(\w+)/], // export interface name
        [1, /function\s+(\w+)/], // function name
        [1, /(constructor).*{/], // constructor
        [2, /(\b(async|public|private|static)\b)\s*function\s+(\w+)/], // kind function name
        [3, /(\b(async|public|private|static)\b)\s+(\b(async|public|private|static)\b)\s*function\s+(\w+)/], // kind kind function name
        [3, /(\b(async|public|private|static)\b)\s+(\b(async|public|private|static)\b)\s+(\w+)\s*\(.*\).*{/], // kind kind name (...) {
        [2, /(\b(async|public|private|static)\b)\s+(\w+)\s*\(.*\).*{/], // kind name (...) {
        // Add other function patterns as needed
    ];
    //@-<< define function patterns >>

}
//@-others

/**
 * The importer callback for typescript.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
    new TS_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
    'extensions': ['.ts',],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
