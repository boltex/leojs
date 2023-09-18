//@+leo-ver=5-thin
//@+node:felix.20230911210454.1: * @file src/importers/python.ts

/**
 * The new, tokenize based, @auto importer for Python.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230911210454.2: ** class Python_Importer
/**
 * Leo's Python importer
 */
export class Python_Importer extends Importer {


  public language = 'python';
  public string_list = ['"""', "'''", '"', "'"];  // longest first.
  public allow_preamble = true;

  // The default patterns. Overridden in the Cython_Importer class.
  // Group 1 matches the name of the class/def.
  public async_def_pat: RegExp = /\s*async\s+def\s+(\w+)\s*\(/;
  public def_pat: RegExp = /\s*def\s+(\w+)\s*\(/;
  public class_pat: RegExp = /\s*class\s+(\w+)/;

  public block_patterns: [string, RegExp][] = [
    ['class', this.class_pat],
    ['async def', this.async_def_pat],
    ['def', this.def_pat],
  ];

  private string_pat1: RegExp = /^([fFrR]*)("""|")/;
  private string_pat2: RegExp = /^([fFrR]*)('''|')/;

  constructor(c: Commands) {
    super(c);
    this.__init__();
  }

  //@+others
  //@+node:felix.20230911210454.3: *3* python_i.adjust_headlines
  /**
   * Add class names for all methods.
   *
   * Change 'def' to 'function:' for all non-methods.
   */
  public adjust_headlines(parent: Position): void {
    const class_pat = /^\s*class\s+(\w+)/; // added caret to match at start of string.

    for (const p of parent.subtree()) {
      if (p.h.startsWith('def ')) {
        // Look up the tree for the nearest class.
        let found = false;
        for (const z of p.parents()) {
          // const m = class_pat.exec(z.h);
          const m = z.h.match(class_pat);

          if (m) {
            p.h = `${m[1]}.${p.h.slice(4).trim()}`;
            found = true;
            break;
          }
        }

        if (!found) {
          if (this.language === 'python') {
            p.h = `function: ${p.h.slice(4).trim()}`;
          }
        }
      }
    }
  }
  //@+node:felix.20230911210454.4: *3* python_i.adjust_at_others
  /**
   * Add a blank line before @others, and remove the leading blank line in the first child.
   */
  public adjust_at_others(parent: Position): void {
    for (const p of parent.subtree()) {
      if (p.h.startsWith('class') && p.hasChildren()) {
        const child = p.firstChild();
        const lines = g.splitLines(p.b);
        for (let i = 0; i < lines.length; i++) {
          if (lines[i] === ' '.repeat(4) + '@others' && child.b.startsWith('\n')) {
            p.b = lines.slice(0, i).join('') + '\n' + lines.slice(i).join('');
            child.b = child.b.slice(1);
            break;
          }
        }
      }
    }
  }
  //@+node:felix.20230911210454.5: *3* python_i.delete_comments_and_strings
  /**
   * Python_i.delete_comments_and_strings.
   *
   * This method handles f-strings properly.
   */
  public delete_comments_and_strings(lines: string[]): string[] {

    /**
     * Skip the remainder of a string.
     *
     * String ends:       return ['', i]
     * String continues:  return [delim, line.length]
     */
    function skip_string(delim: string, i: number, line: string): [string, number] {
      if (!line.includes(delim)) {
        return [delim, line.length];
      }
      const delim_pat = new RegExp("^" + delim); // make sure it's at start of string.
      while (i < line.length) {
        const ch = line[i];
        if (ch === '\\') {
          i += 2;
          continue;
        }

        // const m1 = line.slice(i).match(this.string_pat1);
        const test1 = line.slice(i).match(delim_pat);

        if (test1) {
          return ['', i + delim.length];
        }
        i += 1;
      }
      return [delim, i];
    }

    let delim = ''; // The open string delim.
    const result: string[] = [];


    for (let line_i = 0; line_i < lines.length; line_i++) {
      let i = 0;
      const result_line: string[] = [];
      const line = lines[line_i];
      while (i < line.length) {
        if (delim) {
          [delim, i] = skip_string(delim, i, line);
          continue;
        }
        const ch = line[i];
        if (ch === '#' || ch === '\n') {
          break;
        }

        const m1 = line.slice(i).match(this.string_pat1);
        const m2 = line.slice(i).match(this.string_pat2);
        const m = m1 || m2;

        // const m = this.string_pat1.exec(line.substr(i)) || this.string_pat2.exec(line.substr(i));

        if (m) {
          // Start skipping the string.
          const prefix = m[1];
          delim = m[2];
          i += prefix.length;
          i += delim.length;
          if (i < line.length) {
            [delim, i] = skip_string(delim, i, line);
          }
        } else {
          result_line.push(ch);
          i += 1;
        }
      }

      // End the line and append it to the result.
      if (line.endsWith('\n')) {
        result_line.push('\n');
      }
      result.push(result_line.join(''));
    }

    console.assert(result.length === lines.length); // A crucial invariant.
    return result;

  }
  //@+node:felix.20230911210454.6: *3* python_i.create_preamble
  public create_preamble(blocks: Block[], parent: Position, result_list: string[]): void {
    /**
     * Python_Importer.create_preamble:
     * Create preamble nodes for the module docstrings and everything else.
     */
    console.assert(this.allow_preamble);
    console.assert(parent.__eq__(this.root));

    const lines = this.lines;
    const common_lws = this.compute_common_lws(blocks);
    const [child_kind, child_name, child_start, child_start_body, child_end] = blocks[0];
    const new_start = Math.max(0, child_start_body - 1);
    const preamble_lines = lines.slice(0, new_start);

    if (!preamble_lines.some(line => line.trim())) {
      return;
    }

    function make_node(index: number, preamble_lines: string[], title: string): void {
      const child = parent.insertAsLastChild();
      const parent_s = g.os_path_split(parent.h)[1].replace('@file', '').replace('@clean', '').trim();
      const section_name = `<< ${parent_s}: ${title} >>`;
      child.h = section_name;
      child.b = preamble_lines.join('');
      result_list.splice(index, 0, `${common_lws}${section_name}\n`);
    }

    function find_docstring(): string[] {
      let i = 0;
      while (i < preamble_lines.length) {
        for (const delim of ['"""', "'''"]) {
          if (preamble_lines[i].includes(delim) && preamble_lines[i].split(delim).length - 1 === 1) {
            i += 1;
            while (i < preamble_lines.length) {
              if (preamble_lines[i].includes(delim) && preamble_lines[i].split(delim).length - 1 === 1) {
                return preamble_lines.slice(0, i + 1);
              }
              i += 1;
            }
            return []; // Mal-formed docstring.
          }
        }
        i += 1;
      }
      return [];
    }

    const docstring_lines = find_docstring();
    if (docstring_lines.length > 0) {
      make_node(0, docstring_lines, 'docstring');
      const declaration_lines = preamble_lines.slice(docstring_lines.length);
      if (declaration_lines.length > 0) {
        make_node(1, declaration_lines, 'declarations');
      }
    } else {
      make_node(0, preamble_lines, 'preamble');
    }

    // Adjust this block.
    blocks[0] = [child_kind, child_name, new_start, child_start_body, child_end];
  }
  //@+node:felix.20230911210454.7: *3* python_i.find_blocks
  /**
   * Python_Importer.find_blocks: override Importer.find_blocks.
   *
   * Find all blocks in the given range of *guide* lines from which blanks
   * and tabs have been deleted.
   *
   * Return a list of Blocks, that is, tuples(name, start, start_body, end).
   */
  public find_blocks(i1: number, i2: number): Block[] {

    let i = i1;
    let prev_i = i1;
    const results: Block[] = [];

    /** Return the length of the leading whitespace for s. */
    function lws_n(s: string): number {
      return s.length - s.trimStart().length;
    }

    // Look behind to see what the previous block was.
    const prev_block_line = i1 > 0 ? this.guide_lines[i1 - 1] : '';
    while (i < i2) {
      const s = this.guide_lines[i];
      i += 1;
      for (let [kind, pattern] of this.block_patterns) {
        const m = s.match(pattern);
        if (m) {
          // Cython may include trailing whitespace.
          const name = m[1].trim();
          const end = this.find_end_of_block(i, i2);
          console.assert(i1 + 1 <= end && end <= i2, `Assertion failed: (${i1}, ${end}, ${i2})`);

          // #3517: Don't generate nested defs.
          if (
            kind === 'def' &&
            prev_block_line.trim().startsWith('def ') &&
            lws_n(prev_block_line) < lws_n(s)
          ) {
            // Do nothing, it's a nested def.
          } else {
            results.push([kind, name, prev_i, i, end]);
            i = prev_i = end;
          }
          break;
        }
      }
    }
    return results;
  }
  //@+node:felix.20230911210454.8: *3* python_i.find_end_of_block
  /**
   * i is the index of the class/def line (within the *guide* lines).
   *
   * Return the index of the line *following* the entire class/def.
   *
   * Note: All following blank/comment lines are *excluded* from the block.
   */
  public find_end_of_block(i: number, i2: number): number {
    function lws_n(s: string): number {
      /** Return the length of the leading whitespace for s. */
      return s.length - s.trimStart().length;
    }

    const prev_line = this.guide_lines[i - 1];
    const kinds = ['class', 'def', '->']; // '->' denotes a CoffeeScript function.
    console.assert(kinds.some(kind => prev_line.includes(kind)), `Assertion failed: (${i}, ${JSON.stringify(prev_line)})`);

    // Handle multi-line def's. Scan to the line containing a close parenthesis.
    if (prev_line.trim().startsWith('def ') && !prev_line.includes(')')) {
      while (i < i2) {
        i += 1;
        if (this.guide_lines[i - 1].includes(')')) {
          break;
        }
      }
    }
    let tail_lines = 0;
    if (i < i2) {
      const lws1 = lws_n(prev_line);
      while (i < i2) {
        const s = this.guide_lines[i];
        i += 1;
        if (s.trim()) {
          if (lws_n(s) <= lws1) {
            // A non-comment line that ends the block.
            // Exclude all tail lines.
            return i - tail_lines - 1;
          }
          // A non-comment line that does not end the block.
          tail_lines = 0;
        } else {
          // A comment line.
          tail_lines += 1;
        }
      }
    }
    return i2 - tail_lines;
  }
  //@+node:felix.20230911210454.9: *3* python_i.move_docstrings
  public move_docstrings(parent: Position): void {
    /**
     * Move docstrings to their most convenient locations.
     */

    const delims = ['"""', "'''"];

    //@+others  // define helper functions
    //@+node:felix.20230911210454.10: *4* function: find_docstrings
    /**
     * Righting a regex that will return a docstring is too tricky. 
     */
    function find_docstring(p: Position): string | undefined {
      const s_strip = p.b.trim();
      if (!s_strip) {
        return undefined;
      }
      if (!s_strip.startsWith(delims[0]) && !s_strip.startsWith(delims[1])) {
        return undefined;
      }
      const delim = s_strip.startsWith(delims[0]) ? delims[0] : delims[1];
      const lines = g.splitLines(p.b);
      if (lines[0].split(delim).length === 3) {
        return lines[0];
      }
      let i = 1;
      while (i < lines.length) {
        if (lines[i].includes(delim)) {
          return lines.slice(0, i + 1).join('');
        }
        i += 1;
      }
      return undefined;
    }
    //@+node:felix.20230911210454.11: *4* function: move_docstring
    /**
     * Move a docstring from the child (or next sibling) to the parent. 
     */
    function move_docstring(parent: Position): void {
      const firstChild = parent.firstChild();

      const child = (firstChild && firstChild.__bool__()) ? firstChild : parent.next();
      if (!child || !child.__bool__()) {
        return;
      }
      const docstring = find_docstring(child);
      if (!docstring) {
        return;
      }

      child.b = child.b.slice(docstring.length);
      if (parent.h.startsWith('class')) {
        const parent_lines = g.splitLines(parent.b);
        // Count the number of parent lines before the class line.
        let n = 0;
        while (n < parent_lines.length) {
          const line = parent_lines[n];
          n += 1;
          if (line.trim().startsWith('class ')) {
            break;
          }
        }
        if (n > parent_lines.length) {
          g.printObj(g.splitLines(parent.b), `Noclass line: ${parent.h}`);
          return;
        }
        // This isn't perfect in some situations.
        const docstring_list = g.splitLines(docstring).map((z) => `    ${z}`);
        parent.b = parent_lines.slice(0, n).concat(docstring_list, parent_lines.slice(n)).join('');
      } else {
        parent.b = docstring + parent.b;
      }

      // Delete references to empty children.
      // ric.remove_empty_nodes will delete the child later.
      if (!child.b.trim()) {
        parent.b = parent.b.split(child.h).join('');
      }
    }

    //@-others

    // Move module-level docstrings.
    move_docstring(parent);

    // Move class docstrings.
    for (const p of parent.subtree()) {
      if (p.h.startsWith('class ')) {
        move_docstring(p);
      }
    }


  }

  //@+node:felix.20230911210454.12: *3* python_i.postprocess
  /**
   *  Python_Importer.postprocess. 
   */
  public postprocess(parent: Position): void {
    // See #3514.
    this.adjust_headlines(parent);
    this.move_docstrings(parent);
    this.adjust_at_others(parent);
  }
  //@-others

}
//@-others

/**
 * The importer callback for python.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
  new Python_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
  'extensions': ['.py', '.pyw', '.pyi', '.codon'],  // mypy uses .pyi extension.
  'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
