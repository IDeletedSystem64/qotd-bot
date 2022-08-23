const settings = require('../funcs/settings');

module.exports = {
    event: 'interactionCreate',
    once: false,
    listener: (client) => {
        async (interaction) => {
            if(interaction.isApplicationCommand()) {
            
                await client.commands.get(interaction.commandName)?.parseInteraction(client, interaction);
                
            }
        }
    }
}
