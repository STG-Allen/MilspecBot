import fs from 'fs/promises';
import path from 'path';
import Discord from 'discord.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import type { Command } from './types';

dotenv.config({ path: path.resolve('../', 'config.env') });


const {
  prefix,
  token,
  userName,
  password,
  dbName,
  port,
  hostName,
  useAuth,
} = process.env;

async function main() {

  const client = new Discord.Client();
  client.once('ready', () => console.log('ready!'));

  const dbUrlStr = useAuth ?
  `mongodb://${userName}:${password}@${hostName}:${port}/${dbName}` :
  `mongodb://localhost:27017/${dbName}`;

  try {
    const db = await mongoose.connect(dbUrlStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db.connection.on('error', err => console.trace(err));
  } catch(ex) {
    process.stderr.write('Failed to connect to mongodb. Exception follows');
    process.stderr.write(ex);
    process.exit(1);
  }

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
        await cmdObj.execute(message, ...params);
      } catch(ex) {
        console.trace(`Exception occured when running "${cmdObj.name}".`);
        console.trace(ex);
      }
    }
  });

  client.login(token)

}

main();

