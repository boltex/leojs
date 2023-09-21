//@+leo-ver=5-thin
//@+node:felix.20230912223504.1: * @file src/importers/html.ts
/**
 * The @auto importer for HTML.
 */
import { Commands } from '../core/leoCommands';
import * as g from '../core/leoGlobals';
import { Position } from '../core/leoNodes';
import { Block, Importer } from './base_importer';
import { Xml_Importer } from './xml';

//@+others
//@+node:felix.20230912223504.2: ** class Html_Importer(Xml_Importer)
export class Html_Importer extends Xml_Importer {

    public language = 'html';

    /**
     * Html_Importer.__init__
     */
    constructor(c: Commands) {
        super(c, 'import_html_tags');
        this.__init__();
    }

}
//@-others

/**
 * The importer callback for html.
 */
export const do_import = (c: Commands, parent: Position, s: string) => {
    new Html_Importer(c).import_from_string(parent, s);
};

export const importer_dict = {
    'extensions': ['.html', '.htm',],
    'func': do_import,
};

//@@language typescript
//@@tabwidth -4
//@-leo
