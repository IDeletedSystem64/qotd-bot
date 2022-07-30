const common = require("./common.js");

const REST = require("@discordjs/rest");
const Discord = require("discord.js");

const fs = require("fs");

var account = common.readJsonSync("account.json");

const commands = [
	{
		name: "help",
		description: "Post information about how to use the bot",
		dm_permission: true,
		options: []
	},
	// {
		
	// 	name: "schedule",
	// 	description: "Change the schedule the bot posts on",
	// 	dm_permission: false,
	// 	options: [
	// 		{
	// 			name: "schedule",
	// 			description: "Change the schedule the bot posts on",
	// 			type: Discord.ApplicationCommandOptionType.String,
	// 			required: true,
	// 			choices: [
	// 				{ name: "Hourly", value: "0 * * * *" },
	// 				{ name: "Every day at 00:00", value: "0 0 * * *" },
	// 				{ name: "Every day at 01:00", value: "0 1 * * *" },
	// 				{ name: "Every day at 02:00", value: "0 2 * * *" },
	// 				{ name: "Every day at 03:00", value: "0 3 * * *" },
	// 				{ name: "Every day at 04:00", value: "0 4 * * *" },
	// 				{ name: "Every day at 05:00", value: "0 5 * * *" },
	// 				{ name: "Every day at 06:00", value: "0 6 * * *" },
	// 				{ name: "Every day at 07:00", value: "0 7 * * *" },
	// 				{ name: "Every day at 08:00", value: "0 8 * * *" },
	// 				{ name: "Every day at 09:00", value: "0 9 * * *" },
	// 				{ name: "Every day at 10:00", value: "0 10 * * *" },
	// 				{ name: "Every day at 11:00", value: "0 11 * * *" },
	// 				{ name: "Every day at 12:00", value: "0 12 * * *" },
	// 				{ name: "Every day at 13:00", value: "0 13 * * *" },
	// 				{ name: "Every day at 14:00", value: "0 14 * * *" },
	// 				{ name: "Every day at 15:00", value: "0 15 * * *" },
	// 				{ name: "Every day at 16:00", value: "0 16 * * *" },
	// 				{ name: "Every day at 17:00", value: "0 17 * * *" },
	// 				{ name: "Every day at 18:00", value: "0 18 * * *" },
	// 				{ name: "Every day at 19:00", value: "0 19 * * *" },
	// 				{ name: "Every day at 20:00", value: "0 20 * * *" },
	// 				{ name: "Every day at 21:00", value: "0 21 * * *" },
	// 				{ name: "Every day at 22:00", value: "0 22 * * *" },
	// 				{ name: "Every day at 23:00", value: "0 23 * * *" }
	// 			]
	// 		}
	// 	]
	// },
	// {
	// 	name: "channel",
	// 	description: "Change the channel the bot posts in",
	// 	dm_permission: false,
	// 	options: [
	// 		{
	// 			name: "channel",
	// 			description: "The channel the bot should post in",
	// 			type: Discord.ApplicationCommandOptionType.Channel,
	// 			required: false
	// 		}
	// 	]
	// },
	{
		name: "list",
		description: "List the quotes in the current server",
		dm_permission: false,
		options: [
			{
				name: "page",
				description: "The page number",
				type: Discord.ApplicationCommandOptionType.Integer,
				required: false
			}
		]
	},
	{
		name: "add",
		description: "Add a quote to the pool",
		dm_permission: false,
		default_member_permissions: `${Discord.PermissionFlagsBits.ManageMessages}`,
		options: [
			{
				name: "quote",
				description: "The quote to add",
				type: Discord.ApplicationCommandOptionType.String,
				required: true
			}
		]
	},
	{
		name: "remove",
		description: "Remove a quote from the pool",
		dm_permission: false,
		default_member_permissions: `${Discord.PermissionFlagsBits.ManageMessages}`,
		options: [
			{
				name: "index",
				description: "The index of the quote to remove",
				type: Discord.ApplicationCommandOptionType.Integer,
				required: true
			}
		]
	},
	{
		name: "quote",
		description: "Get a random quote",
		dm_permission: false,
		options: []
	}
];

const rest = new REST.REST({ version: "10" }).setToken(account.token);

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		await rest.put(Discord.Routes.applicationCommands(account.clientId), { body: commands });

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();