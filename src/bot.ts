import fs from 'fs/promises';
import Discord from 'discord.js';

import type { Dict, Command } from './types';

async function readConfig(filePath: string): Promise<Dict<string>> {
  try {
    const configString = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(configString);
  } catch(ex) {
    // I opted to write directly to stderr because console calls are asynchronous
    // thus console.error/console.trace would never fire, the process would
    // simply exit.
    // Direct stderr writes are blocking and this should work fine.
    process.stderr.write('Malformed or non-existent config file.');
    process.stderr.write(ex);
    process.exit(1);
  }
}

async function main() {

  const { prefix, token } = await readConfig('../config.json');
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

