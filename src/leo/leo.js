// import { test2 } from "./app/leoApp.mjs";
const app = require('./app/leoApp');

function test(info) {
    info("leo.js:test 2");
    app.test2(info);
}

// export {test};
module.exports = {test};