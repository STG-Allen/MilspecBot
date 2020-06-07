import Discord from "discord.js";
import Ticket from '../../model/ticket';

import {
  commentDisplay,
  informOfDM,
  ticketNotFound,
} from "../messages/ticket.messages";


export default async function info(message: Discord.Message, ...args: string[]) {
  const embed = new Discord.MessageEmbed().setTitle('Ticket').setColor('GREEN');
  let [, ticketNum] = args;

  if (ticketNum.length < 1) {
    return message.channel.send('No such ticket.').catch(console.error);
  }

  try {
    const ticket = await Ticket.findOne({ number: ticketNum });
    embed.addField('Issue', ticket.description);

    if (ticket.comment.length < 1) {
      embed.addField('Comment: ', 'None')
    } else {
      embed.addFields(ticket.comment.map((v, i)=> ({
        name: `Comment ${i + 1}`,
        value: commentDisplay(v.comment, v.author)
      })));
    }

    embed.addFields([
      { name: 'Status', value: ticket.status },
      { name: 'Created on:', value: ticket.createdUtc }
    ]);

    if (message.guild) {
      message.channel.send(informOfDM).catch(console.error);
    }
    return message.author.send({ embed }).catch(console.error);

  } catch(ex) {
    console.trace(ex);
    return message.channel.send(ticketNotFound);
  }

}