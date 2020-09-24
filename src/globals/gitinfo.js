const { execSync } = require('child_process');

const gitCommand = 'git rev-parse HEAD';

module.exports = function () {
    const sha = execSync(gitCommand).toString().trim();
    return {
        sha,
        short_sha: sha.substr(0, 8)
    };
};