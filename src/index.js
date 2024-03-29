const common = require("./common.js");
const settings = require("../funcs/settings.js");

const Discord = require("discord.js");
const fs = require("fs");

var account = common.readJsonSync("account.json"); // private bot info

var client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });


fs.readdirSync('evts')
  .filter(file => file.endsWith('.js'))
  .map(file => require(`../evts/${file}`))
  .forEach(({ once, event, listener }) => {
    client[once ? 'once' : 'on'](event, listener);
});
// Create listeners from file

client.commands = new Discord.Collection();
fs.readdirSync('cmds')
	.filter(file => file.endsWith('.js'))
	.forEach(file => {
		const cmd = require(`../cmds/${file}`);
		client.commands.set(cmd.name, cmd);
});
// Create a collection and load commands from file

function formatQuotes(quotes, page) {
	if (quotes.length === 0) {
		return "No quotes currently";
	}
	var str = "__**Quotes**__\n\n";

	var indices = [0];
	var lastidx = [];
	var pages = 1;
	var len = 0;
	{
		let tempLen = 0;
		for (let q = 0; q < quotes.length; q++) {
			tempLen += 6 + q.toString().length + quotes[q].length;
			if (tempLen + 50 > 2000) {
				indices.push(q);
				lastidx.push(q);

				pages++;
				tempLen = 0;
				q--;
			} else {
				len += tempLen;
			}
		}
		lastidx.push(quotes.length);
	}
	page = Math.min(page, pages - 1);

	for (let q = indices[page]; q < lastidx[page]; q++) {
		str += `\`${q + 1}\`: ${quotes[q]}\n`;
	}
	str += `\n*Page ${page + 1} of ${pages}*`;

	return str;
}


client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) {
		return;
	}

	switch (interaction.commandName) {
		case "help":
			interaction.reply(`https://cdn.discordapp.com/attachments/800109667682222091/987430733247287336/7D0F2736-2891-4C0D-BC6F-52E5BDEB4B5B.gif`);
			break;
		case "algorithm": // TODO
			break;
		case "schedule":
			let schedule = interaction.options.getString("schedule");
			settings.get(interaction.guildId).schedule = schedule;
			settings.save(interaction.guildId);

			interaction.reply(`Beep boop (Changed schedule to \`${schedule}\`)`);
			break;
		case "channel":
			let channel = interaction.options.getChannel("channel") == null ? interaction.channelId : interaction.options.getChannel("channel").id;
			settings.get(interaction.guildId).channel = channel;
			settings.save(interaction.guildId);

			interaction.reply(`Beep boop (Quotes will now be sent in <#${channel}>)`);
			break;
		case "list":
			let page = interaction.options.getInteger("page") == null ? 0 : interaction.options.getInteger("page") - 1;
			if (page < -1) {
				interaction.reply(`https://tenor.com/view/mlp-fluttershy-not-amused-pony-poker-face-gif-16560766`);
				break;
			} else if (page === -1) {
				interaction.reply(`Beep boop (Indices start at 1)`);
				break;
			}

			interaction.reply({ content: formatQuotes(settings.get(interaction.guildId).quotes, page), flags: Discord.MessageFlags.SuppressEmbeds });
			break;
		case "add":
			let quote = interaction.options.getString("quote");
			settings.get(interaction.guildId).quotes.push(quote);
			settings.save(interaction.guildId);

			interaction.reply(`Beep boop (Added to list of quotes)`);
			break;
		case "remove":
			if (settings.get(interaction.guildId).quotes.length === 0) {
				interaction.reply(`Beep boop (No quotes to remove currently)`);
				break;
			}
			let index = interaction.options.getInteger("index") - 1;
			if (index < -1) {
				interaction.reply(`https://tenor.com/view/mlp-fluttershy-not-amused-pony-poker-face-gif-16560766`);
				break;
			} else if (index === -1) {
				interaction.reply(`Beep boop (Indices start at 1)`);
				break;
			} else if (index > settings.get(interaction.guildId).quotes.length) {
				interaction.reply(`Beep boop (Please enter a number between 1 and ${index})`);
				break;
			} else {
				let quote = settings.get(interaction.guildId).quotes.splice(index, 1);
				settings.save(interaction.guildId);

				interaction.reply(`Beep boop (Removed quote ${index + 1}, _${quote[0]}_)`);
			}
			break;
		case "quote":
			if (settings.get(interaction.guildId).quotes.length < 1) {
				interaction.reply(`Beep boop (Add a quote with \`/add\` first)`);
				break;
			}
			interaction.reply(settings.get(interaction.guildId).quotes[Math.floor(Math.random() * settings.get(interaction.guildId).quotes.length)]);
			break;
	}
});
client.login(account.token);