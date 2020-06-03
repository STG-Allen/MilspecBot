import fs from 'fs/promises';
import path from 'path';
import Discord from 'discord.js';
import dotenv from 'dotenv';
import type { Command } from './types';

dotenv.config({
  path: path.resolve('../', 'config.env')
});

async function main() {

  const { prefix, token } = process.env;
  const client = new Discord.Client();
  client.once('ready', () => console.log('ready!'));

  const commands = new Discord.Collection<string, Command>();
  const commandFiles = await fs.readdir('./commands')
    .then(files => files.filter(f => f.endsWith('.js')));

  for (const file of commandFiles) {
    const command: Command = require(`./commands/${file}`);
    commands.set(command.name, command);
  }

  client.on('message', async function(message) {
    const authorIsSelf = message.author.equals(client.user);
    const lacksPrefix = !message.cleanContent.startsWith(prefix);

    if (authorIsSelf || lacksPrefix) return;

    const params = message.content.substring(prefix.length).split(' ');
    const req = params.shift().toLowerCase();

    const cmdObj = commands.get(req);

    if (cmdObj) {
      try {
        cmdObj.execute(message, ...params);
      } catch(ex) {
        console.trace(`Exception occured when running "${cmdObj.name}".`);
        console.trace(ex);
      }
    }
  });

  client.login(token)

}

main();

