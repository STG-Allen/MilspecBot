import Discord from "discord.js";
import User from '../../model/user';

import { authorIsStaff } from '../common';

import {
  notInGuild,
  noActiveTickets,
  informOfDMList,
  permissionErrorList
} from '../messages/ticket.messages';

export default async function list(message: Discord.Message, ...args: string[]) {
  const embed = new Discord.MessageEmbed().setTitle('Ticket').setColor('RED');
  const [, ...params] = args;

  const userId = message.mentions.users.first()?.id ??
    params[0] ??
    message.author.id;

  if (!message.guild) {
    embed.addField('ERROR', notInGuild);
    return message.channel.send({ embed }).catch(console.error);
  }

  if (!authorIsStaff(message)) {
    // Allow users to view their own ticket list but not that of others.
    if (userId !== message.author.id) {
      embed.addField('ERROR', permissionErrorList);
      return message.channel.send({ embed }).catch(console.error);
    }
  }

  try {
    const result = await User.findOne({ discordId: userId });
    embed.setColor('GREEN');
    if (!result) {
      embed.addField(result.userName, noActiveTickets);
      return message.author.send({ embed }).catch(console.error);
    }
    if (message.guild !== null) {
      message.channel.send(informOfDMList);
    }
    embed.setTitle(result.userName + '\'s Tickets')
    embed.addField('Tickets:', result.ticketNums)
    return message.author.send({ embed })
  } catch(ex) {
    console.trace(ex);
  }

}