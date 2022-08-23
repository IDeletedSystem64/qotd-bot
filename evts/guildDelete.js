const settings = require('../funcs/settings');

module.exports = {
    event: 'guildDelete',
    once: false,
    listener: (guild) => {
        settings.delete(guild.id);
    // Leave settings on disk just in case user re-adds bot
    }
}