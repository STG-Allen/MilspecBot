import Discord from 'discord.js';
import mongoose from 'mongoose';

import config from '../config';

import create from './ticketUtils/create';
import list from './ticketUtils/list';
import info from './ticketUtils/info';
import comment from './ticketUtils/comment';
import close from './ticketUtils/close';
import hold from './ticketUtils/hold';

export default async function initTickets() {

  const {
    userName,
    password,
    dbName,
    port,
    hostName,
    useAuth,
  } = await config;

  const dbUrlStr = useAuth ?
    `mongodb://${userName}:${password}@${hostName}:${port}/${dbName}` :
    `mongodb://localhost:27017/${dbName}`;

  // @ts-ignore
  const db = await mongoose.connect(dbUrlStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });


  const name = 'ticket';
  const description = 'Create, view and comment on tickets.';

  async function execute(message: Discord.Message, ...args: string[]) {
    /**
     * There's no need to await this promise or even care if it failed
     * so just redirect any fail output that is likely caused by insufficient
     * permissions to the console.
     */
    message.delete().catch(console.error);


    switch(args[0]) {
      case 'create': return await create(message, ...args);
      case 'list': return await list(message, ...args);
      case 'info': return await info(message, ...args);
      case 'comment': return await comment(message, ...args);
      case 'close': return await close(message, ...args);
      case 'hold': return await hold(message, ...args);
      default: break;
    }

  }
  return { name, description, execute }

}