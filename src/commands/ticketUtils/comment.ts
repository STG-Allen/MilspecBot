import Discord from "discord.js";
import Ticket from '../../model/ticket';
import Comment from '../../model/comment';
import User from '../../model/user';

import { authorIsStaff } from '../common';

import {
  noComment,
  unspecifiedTicket,
  genericActionError,
  commentSuccess,
  informOfComment,
  permissionError,
  notInGuild,
} from '../messages/ticket.messages';

export default async function comment(message: Discord.Message, ...args: string[]) {
  const embed = new Discord.MessageEmbed().setTitle('Ticket').setColor('RED');
  const [, ticketId, commentId, ...rest] = args;

  if (!(message.guild && authorIsStaff(message))) {
    embed.addField('ERROR', message.guild ? permissionError : notInGuild);
    return message.channel.send({ embed }).catch(console.error);
  }

  if (!ticketId) {
    embed.addField('ERROR', unspecifiedTicket('comment upon'));
    return message.channel.send({ embed }).catch(console.error);
  }

  if (!commentId) {
    embed.addField('ERROR', noComment);
    return message.channel.send({ embed }).catch(console.error);
  }

  const comment = rest.join(' ');
  const commentModel = new Comment({ comment, author: message.author.tag });

  try {
    await Ticket.findOneAndUpdate({ number: ticketId }, {
      $addToSet: { comment: commentModel }
    });
  } catch(ex) {
    console.trace(ex);
    embed.setDescription(genericActionError('comment on', ticketId));
    return message.channel.send({ embed });
  }

  embed.setColor('GREEN');
  embed.addField('Update', commentSuccess(comment, ticketId));
  message.channel.send({ embed }).catch(console.error)

  try {
    const user = await User.findOne({ 'ticketNums': { $in: [ticketId] } });
    const discordUser = message.client.users.cache.get(user.discordId)
    return discordUser.send(informOfComment(comment, ticketId));
  } catch(ex) {
    console.trace(ex);
  }


}