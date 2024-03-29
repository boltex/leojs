//@+leo-ver=5-thin
//@+node:felix.20230911193725.1: * @file src/importers/c.ts
/**
 * The @auto importer for the C language and other related languages.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230911193725.2: ** class C_Importer(Importer)
export class C_Importer extends Importer {

  public language = 'c';

  public string_list = ['"'];  // Not single quotes.

  public block_patterns: [string, RegExp][] = [
    ['class', /.*?\bclass\s+(\w+)\s*\{/],
    ['func', /.*?\b(\w+)\s*\(.*?\)\s*(const)?\s*{/],
    ['namespace', /.*?\bnamespace\s+(\w+)?\s*\{/],
    ['struct', /.*?\bstruct\s+(\w+)?\s*(:.*?)?\{/],
  ];

  // List of compound statements
  public compound_statements_s: string[] = ['case', 'catch', 'class', 'do', 'else', 'for', 'if', 'switch', 'try', 'while'];

  // Create a pattern that matches any compound statement WITH CARET TO MATCH START OF STRING
  public compound_statements_pat = new RegExp(`^\\b(?:${this.compound_statements_s.join('|')})\\b`);

  // Pattern that *might* be continued on the next line. WITH CARET TO MATCH START OF STRING
  public multi_line_func_pat = /^.*?\b(\w+)\s*\(.*?\)\s*(const)?/;

  constructor(c: Commands) {
    super(c);
    this.__init__();
  }

  //@+others
  //@+node:felix.20230911193725.3: *3* c_i.find_blocks
  /**
   * C_Importer.find_blocks: override Importer.find_blocks.
   *
   * Find all blocks in the given range of *guide* lines from which blanks
   * and tabs have been deleted.
   *
   * Return a list of Blocks, that is, tuples(name, start, start_body, end).
   */
  public find_blocks(i1: number, i2: number): Block[] {

    const lines: string[] = this.guide_lines;
    let i: number = i1;
    let prev_i: number = i1;
    const results: Block[] = [];

    while (i < i2) {
      const s: string = lines[i];
      i++;

      for (const [kind, pattern] of this.block_patterns) {
        const m: RegExpExecArray | null = pattern.exec(s);
        const m2: RegExpExecArray | null = this.multi_line_func_pat.exec(s);

        if (m) {
          const name: string = m[1] || '';
          if (
            // Don't match if the line contains a trailing '}'.
            s.substring(m.index + 1).indexOf('}') === -1
            // Don't match compound statements.
            && !this.compound_statements_pat.test(name)
          ) {
            const end: number = this.find_end_of_block(i, i2);
            g.assert(i1 + 1 <= end && end <= i2, `Assertion failed: i1: ${i1}, end: ${end}, i2: ${i2}`);
            const block = new Block(kind, name, prev_i, i + 1, end, this.lines);
            results.push(block);
            i = prev_i = end;
            break;
          }
        } else if (m2 && i < i2) {
          // Don't match compound statements.
          const name: string = m2[1] || '';
          if (
            // The next line must start with '{'
            lines[i].trim().startsWith('{')
            // Don't match compound statements.
            && !this.compound_statements_pat.test(name)
          ) {
            const end: number = this.find_end_of_block(i + 1, i2);
            g.assert(i1 + 1 <= end && end <= i2, `Assertion failed: i1: ${i1}, end: ${end}, i2: ${i2}`);
            const block = new Block('func', name, prev_i, i + 1, end, this.lines);
            results.push(block);
            i = prev_i = end;
            break;
          }
        }
      }
    }

    return results;

  }
  //@-others

}
//@-others

/**
 * The importer callback for c.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
  new C_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
  'extensions': ['.c', '.cc', '.c++', '.cpp', '.cxx', '.h', '.h++',],
  'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
