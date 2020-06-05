import Discord from 'discord.js';

import create from './ticketUtils/create';
import list from './ticketUtils/list';
import info from './ticketUtils/info';
import comment from './ticketUtils/comment';
import close from './ticketUtils/close';
import hold from './ticketUtils/hold';

const name = 'ticket';
const description = 'Create, view and comment on tickets.';

async function execute(message: Discord.Message, ...args: string[]) {

  message.delete().catch(console.error);

  try {
    switch(args[0]) {
      case 'create': return await create(message, ...args);
      case 'list': return await list(message, ...args);
      case 'info': return await info(message, ...args);
      case 'comment': return await comment(message, ...args);
      case 'close': return await close(message, ...args);
      case 'hold': return await hold(message, ...args);
      default: break;
    }
  } catch(ex) {
    console.trace(ex);
  }


}

export { name, description, execute }