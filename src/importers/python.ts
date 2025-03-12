//@+leo-ver=5-thin
//@+node:felix.20230911210454.1: * @file src/importers/python.ts

/**
 * The new, tokenize based, @auto importer for Python.
 */
import * as g from '../core/leoGlobals';
import { Commands } from '../core/leoCommands';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20231011211322.1: ** class Python_Importer
/**
 * Leo's Python importer
 */
export class Python_Importer extends Importer {
  public language: string = 'python';
  public string_list: string[] = ['"""', "'''", '"', "'"]; // longest first.

  /**
   * Patterns. Initialized. Overridden in the Cython_Importer class.
   * Group 1 matches the name of the class/def.
   * USED IN MATCH IN ORIGINAL LEO, SO ADDED '^' TO MATCH BEGINNING OF STRING
   */
  public async_def_pat = /^\s*async\s+def\s+(\w+)\s*\(/;
  public def_pat = /^\s*def\s+(\w+)\s*\(/;
  public class_pat = /^\s*class\s+(\w+)/;

  public block_patterns: [string, RegExp][] = [
    ['class', this.class_pat],
    ['async def', this.async_def_pat],
    ['def', this.def_pat]
  ];

  //  USED IN MATCH IN ORIGINAL LEO, SO ADDED '^' TO MATCH BEGINNING OF STRING
  public string_pat1 = /^([fFrR]*)("""|")/;
  public string_pat2 = /^([fFrR]*)('''|')/;

  //@+others
  //@+node:felix.20231011211322.2: *3* python_i.delete_comments_and_strings
  /**
   * Delete comments and strings.
   * Objective: Handles f-strings properly.
   * @param lines Array of strings.
   * @returns Array of sanitized strings with comments and strings removed.
   */
  public delete_comments_and_strings(lines: string[]): string[] {
    /**
     * Skip the remainder of a string.
     * @param delim The open string delimiter.
     * @param i The current index in line.
     * @param line The line string.
     * @returns Tuple: [New delimiter or empty string, New index].
     */
    const skip_string = (delim: string, i: number, line: string): [string, number] => {
      if (!line.includes(delim)) {
        return [delim, line.length];
      }
      const delim_pat = new RegExp('^' + delim); // python used 'match' so test at begenning of string  
      while (i < line.length) {
        const ch = line[i];
        if (ch === "\\") {
          i += 2;
          continue;
        }
        if (delim_pat.test(line.slice(i))) {
          return ["", i + delim.length];
        }
        i++;
      }
      return [delim, i];
    };

    let delim: string = "";
    let prefix: string = "";
    const result: string[] = [];

    for (const [line_i, line] of lines.entries()) {
      let i = 0;
      let result_line: string[] = [];
      while (i < line.length) {
        if (delim) {
          [delim, i] = skip_string(delim, i, line);
          continue;
        }
        const ch = line[i];
        if (ch === "#" || ch === "\n") {
          break;
        }
        let m = this.string_pat1.exec(line.substring(i)) || this.string_pat2.exec(line.substring(i));
        if (m) {
          [prefix, delim] = [m[1], m[2]];
          i += prefix.length;
          i += delim.length;
          if (i < line.length) {
            [delim, i] = skip_string(delim, i, line);
          }
        } else {
          result_line.push(ch);
          i++;
        }
      }

      if (line.endsWith("\n")) {
        result_line.push("\n");
      }
      // Finally, strip blank lines.
      let result_line_s = result_line.join('');
      if (!result_line_s.trim()) {
        result_line_s = '\n';
      }
      result.push(result_line_s);
    }
    g.assert(result.length === lines.length); // A crucial invariant.
    return result;
  }
  //@+node:felix.20231011211322.3: *3* python_i.find_blocks
  /**
   * Python_Importer.find_blocks: override Importer.find_blocks.
   *
   * Using self.block_patterns and self.guide_lines, return a list of all
   * blocks in the given range of *guide* lines.
   *
   * **Important**: An @others directive will refer to the returned blocks,
   *                so there must be *no gaps* between blocks!
   */
  public find_blocks(i1: number, i2: number): Block[] {
    let i = i1;
    let prev_i = i1;
    const results: Block[] = [];

    /**
     * Return the length of the leading whitespace for s.
    */
    const lws_n = (s: string): number => {
      return s.length - s.trimStart().length;
    };

    //  Look behind to see what the previous block was.
    let prev_block_line = i1 > 0 ? this.guide_lines[i1 - 1] : '';
    while (i < i2) {
      let progress = i;
      let s = this.guide_lines[i];
      i += 1;
      for (const [kind, pattern] of this.block_patterns) {
        const m = pattern.exec(s);
        if (m) {
          // cython may include trailing whitespace.
          let name = m[1].trim();
          const end = this.find_end_of_block(i, i2);
          g.assert(i1 + 1 <= end && end <= i2, `${i1}, ${end}, ${i2}`);

          // #3517: Don't generate nested defs.
          if (
            kind === 'def' &&
            prev_block_line.trim().startsWith('def ') &&
            lws_n(prev_block_line) < lws_n(s)
          ) {
            i = end;
          } else {
            const block = new Block(kind, name, prev_i, i, end, this.lines);
            results.push(block);
            i = prev_i = end;
          }
          break;
        }
      }
      g.assert(i > progress, 'find_blocks in the python importer failed');
    }
    return results;
  }
  //@+node:felix.20231011211322.4: *3* python_i.find_end_of_block
  /**
   * i is the index of the class/def line (within the *guide* lines).
   *
   * Return the index of the line *following* the entire class/def.
   */
  public find_end_of_block(i: number, i2: number): number {

    /**
     * Return the length of the leading whitespace for s.
     */
    const lws_n = (s: string): number => {
      return s.length - s.trimStart().length;
    };

    const prev_line = this.guide_lines[i - 1];
    const kinds = ['class', 'def', '->']; //  '->' denotes a coffeescript function.
    g.assert(
      kinds.some((z) => prev_line.includes(z)),
      `${i}, ${JSON.stringify(prev_line)}`
    );

    // Handle multi-line def's. Scan to the line containing a close parenthesis.
    if (prev_line.trim().startsWith('def ') && !prev_line.includes(')')) {
      while (i < i2) {
        i += 1;
        if (this.guide_lines[i - 1].includes(')')) {
          break;
        }
      }
    }
    let non_tail_lines = 0;
    let tail_lines = 0;
    if (i < i2) {
      const lws1 = lws_n(prev_line);
      while (i < i2) {
        let s = this.guide_lines[i];
        if (s.trim()) {
          // A code line.
          if (lws_n(s) <= lws1) {
            // A codeline that ends the block.
            return non_tail_lines === 0 ? i : i - tail_lines;
          }
          // A code line in the block.
          non_tail_lines += 1;
          tail_lines = 0;
          i += 1;
          continue;
        }
        // A blank, comment or docstring line.
        s = this.lines[i];
        const s_strip = s.trim();
        if (!s_strip) {
          // A blank line.
          tail_lines += 1;
        } else if (s_strip.startsWith('#')) {
          // A comment line.
          if (s_strip && lws_n(s) < lws1) {
            if (non_tail_lines > 0) {
              return i - tail_lines;
            }
          }
          tail_lines += 1;
        } else {
          // A string/docstring line.
          non_tail_lines += 1;
          tail_lines = 0;
        }
        i += 1;

      }
    }
    return i2;
  }
  //@+node:felix.20231011211322.5: *3* python_i.postprocess & helpers
  /**
   * Python_Importer.postprocess.
   */
  public postprocess(parent: Position, result_blocks: Block[]): void {

    //@+others  // Define helper functions.
    //@+node:felix.20231011211322.6: *4* function: adjust_at_others
    /**
     * Add a blank line before @others, and remove the leading blank line in the first child.
     */
    const adjust_at_others = (parent: Position): void => {
      for (const p of parent.subtree()) {
        if (p.h.startsWith('class') && p.hasChildren()) {
          const child = p.firstChild();
          const lines = g.splitLines(p.b);
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.trim().startsWith('@others') && child.b.startsWith('\n')) {
              p.b = lines.slice(0, i).join('') + '\n' + lines.slice(i).join('');
              child.b = child.b.substring(1);
              break;
            }
          }
        }
      }
    };
    //@+node:felix.20231011211322.7: *4* function: adjust_headlines
    /**
     * python_i.adjust_headlines.
     *
     * coffee_script_i also uses this method.
     *
     * Add class names for all methods.
     *
     * Change 'def' to 'function:' for all non-methods.
     */
    const adjust_headlines = (parent: Position): void => {
      for (const child of parent.subtree()) {
        let found = false;
        if (child.h.startsWith('def ')) {
          // Look up the tree for the nearest class.
          for (const ancestor of child.parents()) {
            if (ancestor.__eq__(parent)) {
              break;
            }
            const m = this.class_pat.exec(ancestor.h);
            if (m) {
              found = true;
              // Replace 'def ' by the class name + '.'
              child.h = `${m[1]}.${child.h.substring(4).trim()}`;
              break;
            }
          }
          if (!found) {
            // Replace 'def ' by 'function'
            child.h = `function: ${child.h.substring(4).trim()}`;
          }
        }
      }
    };
    //@+node:felix.20231011211322.8: *4* function: find_docstring
    /**
     * Creating a regex that returns a docstring is too tricky.
     */
    const find_docstring = (p: Position): string | undefined => {
      const delims = ['"""', "'''"];
      const s_strip = p.b.trim();
      if (!s_strip) {
        return undefined;
      }
      if (!s_strip.startsWith(delims[0]) && !s_strip.startsWith(delims[1])) {
        return undefined;
      }
      const delim = s_strip.startsWith(delims[0]) ? delims[0] : delims[1];
      const lines = g.splitLines(p.b);
      if (lines[0].includes(delim) && lines[0].lastIndexOf(delim) !== lines[0].indexOf(delim)) {
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
    };
    //@+node:felix.20231011211322.9: *4* function: move_class_docstring
    /**
     * Move the docstring from child_p to class_p.
     */
    const move_class_docstring = (docstring: string, child_p: Position, class_p: Position): void => {
      // Remove the docstring from child_p.b.
      child_p.b = child_p.b.split(docstring).join('');
      child_p.b = child_p.b.replace(/^\n+/, '');

      // Carefully add the docstring to class_p.b.
      const class_lines = g.splitLines(class_p.b);
      // Count the number of lines before the class line.
      let n = 0;
      while (n < class_lines.length) {
        const line = class_lines[n];
        n += 1;
        if (line.trim().startsWith('class ')) {
          break;
        }
      }
      if (n > class_lines.length) {
        g.printObj(g.splitLines(class_p.b), undefined, undefined, `No class line: ${class_p.h}`);
        return;
      }
      // This isn't perfect in some situations.
      const docstring_list = g.splitLines(docstring).map(z => `    ${z}`);
      class_p.b = [...class_lines.slice(0, n), ...docstring_list, ...class_lines.slice(n)].join('');
    };
    //@+node:felix.20231011211322.10: *4* function: move_class_docstrings
    /**
     * Move class docstrings from the class node's first child to the class node.
     */
    const move_class_docstrings = (parent: Position): void => {
      // Loop through the subtree rooted at parent
      for (const p of parent.subtree()) {
        if (p.h.startsWith('class ')) {
          const child1 = p.firstChild();
          if (child1 && child1.__bool__()) {
            const docstring = find_docstring(child1);
            if (docstring) {
              move_class_docstring(docstring, child1, p);
            }
          }
        }
      }
    };
    //@+node:felix.20231011211322.11: *4* function: move_module_preamble
    /**
     * Move the preamble lines from the parent's first child to the start of parent.b.
     */
    const move_module_preamble = (lines: string[], parent: Position, result_blocks: Block[]): void => {
      const child1 = parent.firstChild();
      if (!child1 || !child1.__bool__()) {
        return;
      }
      // Compute the preamble.
      const preamble_start = Math.max(0, result_blocks[1].start_body - 1);
      const preamble_lines = lines.slice(0, preamble_start);
      const preamble_s = preamble_lines.join('');
      if (!preamble_s.trim()) {
        return;
      }
      // Adjust the bodies.
      parent.b = preamble_s + parent.b;
      child1.b = child1.b.split(preamble_s).join('');
      child1.b = child1.b.replace(/^\n+/, '');
    };
    //@-others

    adjust_headlines(parent);
    move_module_preamble(this.lines, parent, result_blocks);
    move_class_docstrings(parent);
    adjust_at_others(parent);
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
