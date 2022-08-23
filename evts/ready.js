const readJsonSync = require("../src/common");
const settings = require("../funcs/settings");

module.exports = { 
    event: 'ready',
    once: true,
    listener: (client) => {
        console.log('Bot is online!');
        console.log(`Logged in as ${client.user.tag}!`);

        // ToDo: Get this to work asynchronously
        for (let g of client.guilds.cache) {
            settings.read(g[0]);
        }
    }
}