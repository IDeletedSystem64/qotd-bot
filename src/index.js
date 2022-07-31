const common = require("./common.js");

const Discord = require("discord.js");

const fs = require("fs");
const path = require("path");

var account = common.readJsonSync("account.json"); // private bot info
var config = common.readJsonSync("config.json"); // global config

var client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

var settings = new Map(); // server ID -> settings object

function writeSettings(guildId, data) {
	fs.writeFileSync(path.join(config.dataDir, `${guildId}.json`), JSON.stringify(data));
}
function readSettings(guildId) {
	// Why?
	try {
		fs.accessSync(path.join(config.dataDir, `${guildId}.json`), fs.constants.F_OK);
		// File does exist
		settings.set(guildId, JSON.parse(fs.readFileSync(path.join(config.dataDir, `${guildId}.json`))));
	} catch { // File doesn't exist
		writeSettings(guildId, config.defaultSettings);
		settings.set(guildId, config.defaultSettings);
	}
}
function getSettings(guildId) {
	return settings.get(guildId);
}
function saveSettings(guildId) {
	writeSettings(guildId, getSettings(guildId));
}
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

client.on("ready", () => {
	console.log("Bot is online!");
	console.log(`Logged in as ${client.user.tag}!`);

	// TODO get this to work asynchronously
	for (let g of client.guilds.cache) {
		readSettings(g[0]);
	}
});
client.on("guildCreate", (guild) => {
	readSettings(guild.id);
});
client.on("guildDelete", (guild) => {
	settings.delete(guild.id)
	// Leave settings stored on disk just in case they re-add the bot
})
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
			getSettings(interaction.guildId).schedule = schedule;
			saveSettings(interaction.guildId);

			interaction.reply(`Beep boop (Changed schedule to \`${schedule}\`)`);
			break;
		case "channel":
			let channel = interaction.options.getChannel("channel") == null ? interaction.channelId : interaction.options.getChannel("channel").id;
			getSettings(interaction.guildId).channel = channel;
			saveSettings(interaction.guildId);

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

			interaction.reply({ content: formatQuotes(getSettings(interaction.guildId).quotes, page), flags: Discord.MessageFlags.SuppressEmbeds });
			break;
		case "add":
			let quote = interaction.options.getString("quote");
			getSettings(interaction.guildId).quotes.push(quote);
			saveSettings(interaction.guildId);

			interaction.reply(`Beep boop (Added to list of quotes)`);
			break;
		case "remove":
			if (getSettings(interaction.guildId).quotes.length === 0) {
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
			} else if (index > getSettings(interaction.guildId).quotes.length) {
				interaction.reply(`Beep boop (Please enter a number between 1 and ${index})`);
				break;
			} else {
				let quote = getSettings(interaction.guildId).quotes.splice(index, 1);
				saveSettings(interaction.guildId);

				interaction.reply(`Beep boop (Removed quote ${index + 1}, _${quote[0]}_)`);
			}
			break;
		case "quote":
			if (getSettings(interaction.guildId).quotes.length < 1) {
				interaction.reply(`Beep boop (Add a quote with \`/add\` first)`);
				break;
			}
			interaction.reply(getSettings(interaction.guildId).quotes[Math.floor(Math.random() * getSettings(interaction.guildId).quotes.length)]);
			break;
	}
});
client.login(account.token);