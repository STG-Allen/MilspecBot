import fs from 'fs/promises';
import Discord from 'discord.js';

import config from './config';
import type { Command } from './types';


async function main() {

  const { prefix, token } = await config;
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

