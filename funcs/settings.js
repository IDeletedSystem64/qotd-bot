const fs = require('fs');
const path = require('path');
const config = require("../config.json")
var settings = new Map();

function write(guildId, data) {
    fs.writeFileSync(path.join(config.dataDir, `${guildId}.json`), JSON.stringify(data));
}

function read(guildId) {
    try {
        fs.accessSync(path.join(config.dataDirm `${guildId}.json`), fs.constants.F_OK); // File exists
        settings.set(guildId, JSON.parse(fs.readFileSync(path.join(config.dataDir, `${guildId}.json`))));
    }
    catch { // File doesn't exist
        write(guildId, config.defaultSettings);
        settings.set(guildId, config.defaultSettings);       
    }
}
function get(guildId) {
    return settings.get(guildId);
}
function save(guildId) {
    write(guildId, get(guildId));
}

module.exports = {write, read, get, save}