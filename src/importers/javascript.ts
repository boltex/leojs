//@+leo-ver=5-thin
//@+node:felix.20230911233839.1: * @file src/importers/javascript.ts
/**
 * The @auto importer for JavaScript.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230911233839.2: ** class JS_Importer(Importer)
export class JS_Importer extends Importer {

  public language: string = 'javascript';

  // These patterns won't find all functions, but they are a reasonable start.

  // Group 1 must be the block name.
  public block_patterns: [string, RegExp][] = [
    // (? function name ( .*? {
    ['function', /\s*?\(?function\b\s*([\w\.]*)\s*\(.*?\{/],

    // name: ( function ( .*? {
    ['function', /\s*([\w.]+)\s*\:\s*\(*\s*function\s*\(.*?{/],

    // var name = ( function ( .*? {
    ['function', /\s*\bvar\s+([\w\.]+)\s*=\s*\(*\s*function\s*\(.*?{/],

    // name = ( function ( .*? {
    ['function', /\s*([\w\.]+)\s*=\s*\(*\s*function\s*\(.*?{/],

    // ['const', /\s*\bconst\s*(\w+)\s*=.*?=>/],
    // ['let', /\s*\blet\s*(\w+)\s*=.*?=>/],
  ];

  constructor(c: Commands) {
    super(c);
    this.__init__();
  }

  //@+others
  //@+node:felix.20231023212210.1: *3* js_i.delete_comments_and_strings
  /**
   * JS_Importer.delete_comments_and_strings.
   * This method also replaces *apparent* regular expressions with spaces.
   * In general, tokenizing Javascript is context dependent(!!), but it
   * would be unbearable to include a full JS tokenizer.
   */
  public delete_comments_and_strings(lines: string[]): string[] {
    const string_delims: string[] = this.string_list;
    let [line_comment, start_comment, end_comment] = g.set_delims_from_language(this.language);
    let target: string = '';
    const escape: string = '\\';
    const result: string[] = [];

    for (const line of lines) {
      let result_line: string[] = [], skip_count: number = 0;
      for (let i = 0; i < line.length; i++) {
        const ch: string = line[i];
        if (ch === '\n') {
          break;
        } else if (skip_count > 0) {
          result_line.push(' ');
          skip_count -= 1;
        } else if (ch === escape) {
          g.assert(skip_count === 0);
          result_line.push(' ');
          skip_count = 1;
        } else if (target) {
          result_line.push(' ');
          if (g.match(line, i, target)) {
            skip_count = Math.max(0, (target.length - 1));
            target = '';
          }
        } else if (line_comment && line.startsWith(line_comment, i)) {
          break;
        } else if (string_delims.some(z => g.match(line, i, z))) {
          result_line.push(' ');
          for (const z of string_delims) {
            if (g.match(line, i, z)) {
              target = z;
              skip_count = Math.max(0, (z.length - 1));
              break;
            }
          }
        } else if (start_comment && g.match(line, i, start_comment)) {
          result_line.push(' ');
          target = end_comment;
          skip_count = Math.max(0, (start_comment.length - 1));
        } else if (ch === '/') {
          const j: number = line.indexOf('/', i + 1);
          if (j > -1) {
            result_line.push(' ');
            skip_count = j - i + 1;
          } else {
            result_line.push(ch);
          }
        } else {
          result_line.push(ch);
        }
      }
      const end_s: string = line.endsWith('\n') ? '\n' : '';
      result.push(result_line.join('').trimEnd() + end_s);
    }
    g.assert(result.length === lines.length);  // A crucial invariant.
    return result;
  }
  //@-others

}
//@-others

/**
 * The importer callback for javascript.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
  new JS_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
  'extensions': ['.js',],
  'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
