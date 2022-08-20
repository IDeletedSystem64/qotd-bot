Sends a random quote to Discord upon request (scheduled is planned)

### Allowing the bot to post on Discord:

Run ``npm install`` to download and install bot dependencies
Create a file `account.json` in the project root and fill in the following information:
```
{
	"token": "<token>",
	"clientId": "<application id>"
}
```
**Don't share this information online**. It's in .gitignore already so you can't publish it to GitHub by accident\
You can get this information from the [Developer Portal](https://discord.com/developers)

Make sure to run the deploy npm script before deploying your application to register the commands (to run the application like normal, use `npm run start`)