// leojs.src.ekr.test.leo.js

// node --experimental-import-meta-resolve leo.js

import { test2 } from "./app.js";

function test(info) {
    console.log("leo.js:test")
    test2(info)
}

export {test};