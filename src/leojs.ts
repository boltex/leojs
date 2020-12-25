import * as leoFiles from "./leoFiles";
import { LeoButton, LeoDocument, PNode } from "./types";

// https://github.com/leo-editor/leo-editor/issues/1025

// For now give results to tree view panels (outline, documents and at-buttons)

export class Leojs {

    // (naive) model of the outline
    // simulates _yieldAllRootChildren from leoInteg's leobridgeserver.py
    public positions: PNode[] = [
        {
            header: "node1",
            body: "node1 body",
            children: [
                {
                    header: "nodeInside1",
                    body: "nodeInside1 body",
                    children: []
                }, {
                    header: "nodeInside2",
                    body: "nodeInside2 body",
                    children: []
                },
            ]
        },
        {
            header: "node2",
            body: "", // Empty body should display icon without blue square
            children: []
        },

        {
            header: "node3",
            body: "node3 body",
            children: []
        },
    ];

    // Fake documents array
    public documents: LeoDocument[] = [
        { name: "fakeSelectedDoc1.leo", index: 0, changed: false, selected: true },
        { name: "fakeChangedDoc2.leo", index: 1, changed: true, selected: false },
        { name: "fakeDoc3.leo", index: 2, changed: false, selected: false }
    ];

    // Fake @ buttons array
    public atButtons: LeoButton[] = [
        { name: 'script-button', index: 'nullButtonWidget' },
        { name: 'button name 2', index: 'key2' },
        { name: 'button name 3', index: 'key3' }
    ];

    constructor() { }

}
