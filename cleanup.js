/* 
  * Remove those 3 entries from package.json
  "gitCommit": "e807884",
  "gitBranch": "devel",
  "gitDate": "2022-04-17 19:38:05 -0400"
*/

const fs = require('fs');
const fileName = './package.json';
const file = require(fileName);

file.gitCommit = undefined;
file.gitBranch = undefined;
file.gitDate = undefined;

console.log('Running cleanup.js');

fs.writeFileSync(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
  if (err) return console.log(err);
  // console.log(JSON.stringify(file));
  console.log('writing to ' + fileName);
});

console.log("Removed git info in package.json");