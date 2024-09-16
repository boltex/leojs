const fs = require('fs-extra');
const path = require('path');

// Define the paths
const sourceDir = path.join(__dirname, 'build');
const targetDir = path.join(__dirname, '..', 'docs');

// Empty the target directory first
fs.emptyDir(targetDir, function (err) {
    if (err) {
        console.error('Error clearing the target directory:', err);
        return;
    }
    console.log('Target directory cleared.');

    // Copy the directory
    fs.copy(sourceDir, targetDir, function (err) {
        if (err) {
            console.error('Error copying files:', err);
            return;
        }
        console.log('Build directory copied successfully!');
    });
});