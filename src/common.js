const fs = require("fs");

function readJsonSync(filepath) {
	return JSON.parse(fs.readFileSync(filepath));
}

module.exports.readJsonSync = readJsonSync;