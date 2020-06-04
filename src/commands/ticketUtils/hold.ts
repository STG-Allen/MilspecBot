import Discord from "discord.js";
import Ticket from '../../model/ticket';
import User from '../../model/user';

import {
  permissionError,
  notInGuild,
  unspecifiedTicket,
  informOfHold,
  genericActionError,
} from '../messages/ticket.messages';

export default async function hold(message: Discord.Message, ...args: string[]) {
  const embed = new Discord.MessageEmbed().setTitle('Ticket').setColor('RED');
  const authorIsStaff = message.member.roles.cache.some(role => role.name === 'Staff');

  const [, ticketId] = args;

  if (!(message.guild && authorIsStaff)) {
    embed.addField('ERROR', message.guild ? permissionError : notInGuild);
    return message.channel.send({ embed }).catch(console.error);
  }

  if (!ticketId) {
    embed.addField('ERROR', unspecifiedTicket('hold'));
    return message.channel.send({ embed }).catch(console.error);
  }

  try {
    const ticket = await Ticket.findOne({ number: ticketId });
    // no point in changing anything if it's already held.
    if (ticket.status === 'hold') return;
    await Ticket.findOneAndUpdate({ number: ticketId }, {
      $set: { status: 'hold' }
    });
    embed.setColor('GREEN')
    embed.addField('Held Ticket', ticket.number)
    message.channel.send({ embed }).catch(console.error);
  } catch(ex) {
    console.trace(ex);
    embed.addField('Error', genericActionError('hold', ticketId));
    return message.reply(embed);
  }

  try {
    const user = await User.findOne({ 'ticketNums': { $in: [ticketId] } });
    const discordUser = message.client.users.cache.get(user.discordId)
    return discordUser.send(informOfHold(ticketId)).catch(console.error);
  } catch(ex) {
    console.trace(ex);
  }

}