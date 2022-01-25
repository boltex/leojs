import * as vscode from "vscode";
import { Constants } from "./constants";
import { IconConstants } from "./iconConstants";
import { Icon } from "./types";
import { LeoOutlineNode } from "./leoOutline";
// import 'browser-hrtime';
// require('browser-hrtime');

// String and other types/structures helper functions, along with common vscode API calls

/**
 * * Build a string for representing a number that's 2 digits wide, padding with a zero if needed
 * @param p_number Between 0 and 99
 * @returns a 2 digit wide string representation of the number, left padded with zeros as needed.
 */
export function padNumber2(p_number: number): string {
    return ("0" + p_number).slice(-2);
}

/**
 * * Performs the actual addition into globalState context
 * @param p_context Needed to get to vscode global storage
 * @param p_file path+file name string
 * @param p_key A constant string such as RECENT_FILES_KEY or LAST_FILES_KEY
 * @returns A promise that resolves when the global storage modification is done
 */
export function addFileToGlobal(p_context: vscode.ExtensionContext, p_file: string, p_key: string): Thenable<void> {
    // Just push that string into the context.globalState.<something> array
    const w_contextEntry: string[] = p_context.globalState.get(p_key) || [];
    if (w_contextEntry) {
        if (!w_contextEntry.includes(p_file)) {
            w_contextEntry.push(p_file);
            if (w_contextEntry.length > 10) {
                w_contextEntry.shift();
            }
        }
        return p_context.globalState.update(p_key, w_contextEntry); // Added file
    } else {
        // First so create key entry with an array of single file
        return p_context.globalState.update(p_key, [p_file]);
    }
}

/**
 * * Removes file entry from globalState context
 * @param p_context Needed to get to vscode global storage
 * @param p_file path+file name string
 * @param p_key A constant string such as RECENT_FILES_KEY or LAST_FILES_KEY
 * @returns A promise that resolves when the global storage modification is done
  */
export function removeFileFromGlobal(p_context: vscode.ExtensionContext, p_file: string, p_key: string): Thenable<void> {
    // Check if exist in context.globalState.<something> and remove if found
    const w_files: string[] = p_context.globalState.get(p_key) || [];
    if (w_files && w_files.includes(p_file)) {
        w_files.splice(w_files.indexOf(p_file), 1); // Splice and update
        return p_context.globalState.update(p_key, w_files);
    }
    return Promise.resolve(); // not even in list so just resolve
}

/**
 * * Build all possible strings for node icons graphic file paths
 * @param p_context Needed to get to absolute paths on the system
 * @returns An array of the 16 vscode node icons used in this vscode expansion
 */
export function buildNodeIconPaths(p_context: vscode.ExtensionContext): Icon[] {

    const testUri = vscode.Uri.from({
        scheme: "data",
        path: 'image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" height="16" width="16"><path fill="#4d4d4d" d="M0 4v9h15.15V4zm1 1h13.15v7H1z"/></svg>'
    });

    console.log(testUri.toString());

    return Array(16).fill("").map((p_val, p_index) => {
        return {
            light: vscode.Uri.from({
                scheme: "data",
                path: 'image/svg+xml;utf8,' + '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">' + IconConstants.nodeIcons[p_index < 8 ? p_index + 8 : p_index - 8] + '</svg>'
            }),
            dark: vscode.Uri.from({
                scheme: "data",
                path: 'image/svg+xml;utf8,' + '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">' + IconConstants.nodeIcons[p_index] + '</svg>'
            })
        };
    });
}

/**
 * * Build all possible strings for documents icons graphic file paths
 * @param p_context Needed to get to absolute paths on the system
 * @returns An array containing icons for the documents tree view
 */
export function buildDocumentIconPaths(p_context: vscode.ExtensionContext): Icon[] {
    return [
        {
            light: vscode.Uri.from({
                scheme: "data",
                path: 'image/svg+xml;utf8,' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">' +
                    IconConstants.leoDocuments[2] +
                    '</svg>'
            }),
            dark: vscode.Uri.from({
                scheme: "data",
                path: 'image/svg+xml;utf8,' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">' +
                    IconConstants.leoDocuments[0] +
                    '</svg>'
            })
        },
        {
            light: vscode.Uri.from({
                scheme: "data",
                path: 'image/svg+xml;utf8,' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">' +
                    IconConstants.leoDocuments[3] +
                    '</svg>'
            }),
            dark: vscode.Uri.from({
                scheme: "data",
                path: 'image/svg+xml;utf8,' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">' +
                    IconConstants.leoDocuments[1] +
                    '</svg>'
            })
        }
    ];
}

/**
 * * Build all possible strings for buttons icons graphic file paths
 * @param p_context Needed to get to absolute paths on the system
 * @returns An array containing icons for the documents tree view
 */
export function buildButtonsIconPaths(p_context: vscode.ExtensionContext): Icon[] {
    return [
        {
            light: vscode.Uri.from({
                scheme: "data",
                path: 'image/svg+xml;utf8,' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">' +
                    IconConstants.button[1] +
                    '</svg>'
            }),
            dark: vscode.Uri.from({
                scheme: "data",
                path: 'image/svg+xml;utf8,' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">' +
                    IconConstants.button[0] +
                    '</svg>'
            })
        },
        {
            light: vscode.Uri.from({
                scheme: "data",
                path: 'image/svg+xml;utf8,' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">' +
                    IconConstants.scriptButtons[1] +
                    '</svg>'
            }),
            dark: vscode.Uri.from({
                scheme: "data",
                path: 'image/svg+xml;utf8,' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">' +
                    IconConstants.scriptButtons[0] +
                    '</svg>'
            })
        }
    ];
}

/**
 * Convert Leo's internal filetype descriptions array
 * to vscode's option format for open/save dialogs.
 */
export function convertLeoFiletypes(p_filetypes: [string, string][]): { [name: string]: string[] } {
    /*
        from :
            [
                ["", ""],
                ["Leo files", "*.leo *.db"]
            ],

        to :
        {
            'Images': ['png', 'jpg']
            'TypeScript': ['ts', 'tsx']
        }

    */
    const w_types: { [name: string]: string[] } = {};
    p_filetypes.forEach(type => {
        w_types[type[0]] = type[1].split(" ").map((p_entry) => {

            return p_entry.startsWith("*.") ? p_entry.substring(2) : p_entry;
        });
    });
    return w_types;
}
/**
 * * Returns milliseconds between the p_start process.hrtime tuple and p_end (or current call to process.hrtime)
 * @param p_start starting process.hrtime to subtract from p_end or current immediate time
 * @param p_end optional end process.hrtime (or immediate time)
 * @returns number of milliseconds passed since the given start hrtime
 */
export function getDurationMs(p_start: [number, number], p_end?: [number, number]): number {
    if (!p_end) {
        p_end = process.hrtime(p_start);
    }
    const [w_secs, w_nanosecs] = p_end;
    return w_secs * 1000 + Math.floor(w_nanosecs / 1000000);
}

/**
 * * Extracts the file name from a full path, such as "foo.bar" from "/abc/def/foo.bar"
 * @param p_path Full path such as "/var/drop/foo/boo/moo.js" or "C:\Documents and Settings\img\recycled log.jpg"
 * @returns file name string such as "moo.js" or "recycled log.jpg""
 */
export function getFileFromPath(p_path: string): string {
    return p_path.replace(/^.*[\\\/]/, '');
}

/**
 * * Checks if a node would become dirty if it were to now have body content at all
 * @param p_node LeoNode from vscode's outline
 * @param p_newHasBody Flag to signify presence of body content, to be compared with its current state
 * @returns True if it would change the icon with actual body content, false otherwise
 */
export function isIconChangedByEdit(p_node: LeoOutlineNode, p_newHasBody: boolean): boolean {
    if (!p_node.dirty || (p_node.hasBody === !p_newHasBody)) {
        return true;
    }
    return false;
}

/**
 * * Checks if a string is formatted as a valid rrggbb color code.
 * @param p_hexString hexadecimal 6 digits string, without leading '0x'
 * @returns True if the string is a valid representation of an hexadecimal 6 digit number
 */
export function isHexColor(p_hexString: string): boolean {
    return typeof p_hexString === 'string'
        && p_hexString.length === 6
        && !isNaN(Number('0x' + p_hexString));
}

/**
* Builds a 'Leo Scheme' vscode.Uri from a gnx (or strings like 'LEO BODY' or empty strings to decorate breadcrumbs)
* @param p_str leo node gnx strings are used to build Uri
* @returns A vscode 'Uri' object
*/
export function strToLeoUri(p_str: string): vscode.Uri {
    return vscode.Uri.parse(Constants.URI_SCHEME_HEADER + p_str);
}

/**
 * * Gets the gnx, (or another string like 'LEO BODY' or other), from a vscode.Uri object
 * @param p_uri Source uri to extract from
 * @returns The string source that was used to build this Uri
 */
export function leoUriToStr(p_uri: vscode.Uri): string {
    // TODO : Use length of a constant or something other than 'fsPath'
    // For now, just remove the '/' (or backslash on Windows) before the path string
    return p_uri.fsPath.substr(1);
}

/**
 * * Sets a vscode context variable with 'vscode.commands.executeCommand' & 'setContext'
 * @param p_key Key string name such as constants 'leoReady' or 'treeOpened', etc.
 * @param p_value Value to be assigned to the p_key 'key'
 * @returns A Thenable that is returned by the executeCommand call
 */
export function setContext(p_key: string, p_value: any): Thenable<unknown> {
    return vscode.commands.executeCommand(Constants.VSCODE_COMMANDS.SET_CONTEXT, p_key, p_value);
}

/**
 * * experiment
 */
export function experiment(): void {
    // fs.readFileSync('foo.txt','utf8');
    console.log("test");
}
