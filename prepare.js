let gitCommit = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim();

let gitBranch = require('child_process')
    .execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim();

let gitInfo = require('child_process')
    .execSync('git log -n 1 --date=iso')
    .toString()
    .trim()
    .split('\n');

let gitDate = "";

for (line of gitInfo) {
    if (line.startsWith("Date:")) {
        gitDate = line.slice(5).trim();
    }
}

const fs = require('fs');
const fileName = './package.json';
const file = require(fileName);

file.gitCommit = gitCommit;
file.gitBranch = gitBranch;
file.gitDate = gitDate;

fs.writeFileSync(fileName, JSON.stringify(file, null, 2), function writeJSON(err) {
    if (err) return console.log(err);
    // console.log(JSON.stringify(file));
    console.log('writing to ' + fileName);
});

console.log("Added git info in package.json");
