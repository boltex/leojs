//@+leo-ver=5-thin
//@+node:felix.20230913212159.1: * @file src/importers/java.ts
/**
 * The @auto importer for the java language.
 */
import * as g from '../core/leoGlobals';
import { Commands } from '../core/leoCommands';
import { Position } from '../core/leoNodes';
import { Importer } from './base_importer';

//@+others
//@+node:felix.20230913212159.2: ** class Java_Importer(Importer)
/**
 * The importer for the java language.
 */
export class Java_Importer extends Importer {

  public language = 'java';

  public compound_statements = ['else', 'for', 'if', 'switch', 'while'];

  public block_patterns: [string, RegExp][] = [

    ['interface', /^\s*interface\s+(\w+.*?)\s*((implements|throws).*?)?{/],
    ['', /^\s*(.*?\bclass\s+\w+)/],
    ['', /^\s*(\w+.*?)\(.*?\)\s*((implements|throws).*?)?{/],

  ];

  constructor(c: Commands) {
    super(c);
    this.__init__();
  }

  //@+others
  //@+node:felix.20260510003927.1: *3* java_i.postprocess
  /**
   * Java_Importer.postprocess.
   */
  public postprocess(parent: Position): void {
    // Base-class method.
    this.move_blank_lines(parent);

    // Subclass methods...
    this.move_module_preamble(parent);
  }
  //@+node:felix.20260510003934.1: *3* java_i.move_module_preamble
  /**
   * Move the preamble lines from the parent's first child to the start of parent.b.
   */
  public move_module_preamble(parent: Position): void {
    const child1 = parent.firstChild();
    if (!child1 || !child1.v) {
      return;
    }

    const match = (s: string): boolean => {
      for (const [kind, pattern] of this.block_patterns) {
        if (pattern.test(s)) {
          return true;
        }
      }
      return false;
    };

    // The preamble is everything up to the line that first matches a block
    const lines = g.splitLines(child1.b);
    for (let i = 0; i < lines.length; i++) {
      if (match(lines[i])) {
        // Adjust the bodies.
        const preamble_s = lines.slice(0, i).join('');
        parent.b = preamble_s + parent.b;
        child1.b = preamble_s ? child1.b.split(preamble_s).join('') : child1.b;
        return;
      }
    }
  }
  //@-others

}
//@-others

/**
 * The importer callback for java.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
  new Java_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
  'extensions': ['.java'],
  'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
