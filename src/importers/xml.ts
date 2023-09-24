//@+leo-ver=5-thin
//@+node:felix.20230912233339.1: * @file src/importers/xml.ts
/**
 * The @auto importer for the xml language.
 */

import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';

//@+others
//@+node:felix.20230912233339.2: ** class Xml_Importer(Importer)
/** 
 * The importer for the xml language.
 */
export class Xml_Importer extends Importer {

  public language = 'xml';
  public minimum_block_size = 2; // Helps handle one-line elements.

  // xml_i.add_tags defines all patterns.
  public end_patterns: RegExp[] | null = null;
  public start_patterns: RegExp[] | null = null;

  public tag_name_pat = /^<\/?([a-zA-Z]+)/; // added caret to match python's 'match'
  // Match two adjacent elements. Don't match comments.
  public adjacent_tags_pat = /(.*?)(<[^!].*?>)\s*(<[^!].*?>)/g;

  /**
   * Xml_Importer.__init__
   */
  constructor(c: Commands, tags_setting: string = 'import_xml_tags') {
    super(c);
    this.__init__();
    this.add_tags(tags_setting);
  }

  //@+others
  //@+node:felix.20230912233339.3: *3* xml_i.add_tags
  /**
   * Add items to self.class/functionTags and from settings.
   */
  public add_tags(setting: string): string[] {
    // Get the tags from the settings.
    let tags = this.c.config.getData(setting) || [];

    // Allow both upper and lower case tags.
    tags = tags.map((z) => z.toLowerCase()).concat(tags.map((z) => z.toUpperCase()));

    // m.group(1) must be the tag name.
    this.block_patterns = tags.map((tag) => [tag, new RegExp(`^\\s*<(${tag})`)]); // caret for start of string
    this.start_patterns = tags.map((tag) => new RegExp(`^\\s*<(${tag})`)); // caret for start of string
    this.end_patterns = tags.map((tag) => new RegExp(`^\\s*</(${tag})>`)); // caret for start of string
    return tags;
  }
  //@+node:felix.20230912233339.4: *3* xml_i.compute_headline
  /**
   * Xml_Importer.compute_headline.
   */
  public compute_headline(block: Block): string {
    const [child_kind, , child_start, child_start_body] = block;
    const n = Math.max(child_start, child_start_body - 1);
    return this.lines[n].trim();
  }
  //@+node:felix.20230912233339.5: *3* xml_i.find_end_of_block
  /**
   * i is the index of the line *following* the start of the block.
   *
   * Return the index of the start of next block.
   */
  public find_end_of_block(i1: number, i2: number): number {
    // Get the tag that started the block
    const tag_stack: string[] = [];
    let tag1: string | null = null;
    let i = i1;
    let line = this.guide_lines[i1 - 1];
    for (const pattern of this.start_patterns!) {
      // const m = pattern.exec(line);
      const m = line.match(pattern);
      if (m) {
        tag1 = m[1].toLowerCase();
        tag_stack.push(tag1);
        break;
      }
    }
    if (!tag1) {
      throw new Error('No opening tag');
    }

    while (i < i2) {
      line = this.guide_lines[i];
      i += 1;

      // Push start patterns.
      for (const pattern of this.start_patterns!) {
        // const m = pattern.exec(line);
        const m = line.match(pattern);
        if (m) {
          const tag = m[1].toLowerCase();
          tag_stack.push(tag);
          break;
        }
      }

      for (const pattern of this.end_patterns!) {
        // const m = pattern.exec(line);
        const m = line.match(pattern);
        if (m) {
          const endTag = m[1].toLowerCase();
          let w_found = false;
          while (tag_stack.length) {
            const tag = tag_stack.pop();
            if (tag === endTag) {
              w_found = true;
              if (!tag_stack.length) {
                return i;
              }
              break;
            }
          }
          if (!w_found) {
            return i1; // Don't create a block.
          }

        }
      }
    }
    return i1; // Don't create a block.
  }
  //@+node:felix.20230912233339.6: *3* xml_i.preprocess_lines
  public preprocess_lines(lines: string[]): string[] {
    const result_lines: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const s = line.replace(this.adjacent_tags_pat, (match: string, group1: string, group2: string, group3: string) => {
        const m2 = group2.match(this.tag_name_pat);
        const m3 = group3.match(this.tag_name_pat);
        const tag_name2 = m2 ? m2[1] : '';
        const tag_name3 = m3 ? m3[1] : '';
        const same_element =
          tag_name2 === tag_name3 &&
          !group2.startsWith('</') &&
          group3.startsWith('</');
        const lws = g.get_leading_ws(group1);
        const sep = same_element ? '' : '\n' + lws;
        return group1 + group2.trimEnd() + sep + group3;
      });
      result_lines.push(...g.splitLines(s));
    }
    return result_lines;
  }
  //@-others

}
//@-others

/**  
 * The importer callback for xml.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
  new Xml_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
  'extensions': ['.xml',],
  'func': do_import,
};
//@@language typescript
//@@tabwidth -4

//@-leo
