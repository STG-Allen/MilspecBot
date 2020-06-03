import Discord from "discord.js";
import Ticket from '../../model/ticket';
import User from '../../model/user';

import {
  permissionError,
  notInGuild,
  unspecifiedTicket,
  informOfClosure,
  ticketStatusAlready,
  genericActionError,
} from '../messages/ticket.messages';

export default async function close(message: Discord.Message, ...args: string[]) {
  const embed = new Discord.MessageEmbed().setTitle('Ticket');
  const authorIsStaff = message.member.roles.cache.some(role => role.name === 'Staff');

  const [, ticketId] = args;
  const [,, ...solutionParts] = args ?? [,, 'unknown'];
  const solution = solutionParts.join(' ');

  if (!(message.guild && authorIsStaff)) {
    embed.setColor('RED')
    embed.addField('ERROR', message.guild ? permissionError : notInGuild);
    return message.channel.send({ embed }).catch(console.error);
  }

  if (!ticketId) {
    embed.setColor('RED')
    embed.addField('ERROR', unspecifiedTicket('close'));
    return message.channel.send({ embed }).catch(console.error);
  }

  try {
    const ticket = await Ticket.findOne({ number: ticketId });

    /**
     * TODO: Perhaps remove this bit entirely to allow for solution updates.
     */
    if (!['open', 'hold'].includes(ticket.status)) {
      return message.reply(ticketStatusAlready('closed', ticketId));
    }

    await Ticket.findOneAndUpdate({ number: ticketId }, {
      $set: { status: 'closed', solution }
    });

    embed.setColor('GREEN');
    embed.addField('Closed Ticket', ticket.number);

    message.channel.send({ embed }).catch(console.error);

    const user = await User.findOne({ 'ticketNums': { $in: [ticketId] } });
    const discordUser = message.client.users.cache.get(user.discordId)

    return discordUser.send(informOfClosure(ticketId, solution)).catch(console.error);

  } catch(ex) {
    console.trace(ex);
    embed.setColor('RED');
    embed.addField('Error', genericActionError('close', ticketId));
    return message.reply(embed);
  }


}