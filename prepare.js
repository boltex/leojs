console.log('Running prepare.js');

let gitCommit = 'unknown';
let gitBranch = ' unknown';
let gitInfo = 'unknown';
let gitDate = 'unknown';

try {
    gitCommit = require('child_process')
        .execSync('git rev-parse --short HEAD')
        .toString()
        .trim();

    gitBranch = require('child_process')
        .execSync('git rev-parse --abbrev-ref HEAD')
        .toString()
        .trim();

    gitInfo = require('child_process')
        .execSync('git log -n 1 --date=iso')
        .toString()
        .trim()
        .split('\n');

    for (line of gitInfo) {
        if (line.startsWith("Date:")) {
            gitDate = line.slice(5).trim();
        }
    }
} catch (p_err) {
    console.log("ERROR running git commands in prepare.js", p_err);
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
