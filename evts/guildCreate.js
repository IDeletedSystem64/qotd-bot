const settings = require("../funcs/settings");

module.exports = {
    event: 'guildCreate',
    once: false,
    listener: (guild) => {
        settings.read(guild.id);
    }
}