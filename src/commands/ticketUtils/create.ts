import Discord from "discord.js";
import User from '../../model/user';
import Ticket from '../../model/ticket';

import {
  noTicketReason,
  ticketCreationSuccess,
  newUserEntry,
  ticketCreationFailure,
  informOfTicketCreation,
} from '../messages/ticket.messages';

export default async function create(message: Discord.Message, ...args: string[]) {

  const { logChannel, prefix } = process.env;
  const embed = new Discord.MessageEmbed().setTitle('Ticket').setColor('RED');
  const logEmbed = new Discord.MessageEmbed().setTitle('New Ticket!').setColor('GREEN');
  const [, ...params] = args;
  const logTo = message.client.channels.cache.get(logChannel) as Discord.TextChannel;
  const description = params.join(' ');

  if (description.length < 10) {
    embed.addField('Error', noTicketReason);
    return message.reply({ embed }).catch(console.error);
  }

  try {
    const ticketCount = (await Ticket.countDocuments({})) + 1;
    const doc = await User.findOne({userName: message.author.tag});

    const ticket = await new Ticket({
      number: ticketCount,
      description: description,
      comment: [],
      createdUtc: Date.now(),
      status: 'open',
      solution: 'none'
    }).save();

    if (doc) {
      await User.findOneAndUpdate(
        { userName: message.author.tag },
        { $addToSet: { ticketNums: ticketCount.toString() } },
        { new: true });
    } else {
      logTo.send(newUserEntry(message.author.tag)).catch(console.error);
      await new User({
        userName: message.author.tag,
        ticketNums: ticket.number,
        discordId: message.author.id
      }).save();
    }
    embed.setColor('GREEN');
    embed.addField('Success', ticketCreationSuccess(description, ticket.number));

    message.author.send({ embed }).catch(console.error);

    logEmbed.addFields([
      { name: 'Info', value: informOfTicketCreation(ticket.number, prefix) },
      { name: 'Preview', value: ticket.description }
    ]);

    return logTo.send({ embed: logEmbed }).catch(console.error);

  } catch(ex) {
    console.trace(ex)
    embed.addField('ERROR', ticketCreationFailure)
    return message.channel.send({ embed }).catch(console.error);
  }
}