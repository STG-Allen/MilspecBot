const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

client.once('ready', () => {
    console.log('ready!');
});

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', message => {
    if (message.author.equals(client.user) || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if (message.content === 'website') {
        client.commands.get('website').execute(message);
    }

    if(message.content === 'crashreport') {
        client.commands.get('crashreport').execute(message);
    }

    if(message.content === 'ip') {
        client.commands.get('ip').execute(message);
    }

    if(command === 'ticket') {
        client.commands.get("ticket").execute(client, message, args);
    }
})

client.login(token)