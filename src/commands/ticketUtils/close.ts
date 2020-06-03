import Discord from "discord.js";
import Ticket from '../../model/ticket';
import User from '../../model/user';

export default async function close(message: Discord.Message, ...args: string[]) {
  const embed = new Discord.MessageEmbed().setTitle('Ticket');
  const authorIsStaff = message.member.roles.cache.some(role => role.name === 'Staff');

  const [, ticketId] = args;

  const [,, ...solution] = args ?? [,, 'unknown'];

  if (!(message.guild && authorIsStaff)) {
    embed.setColor('RED')
    if (message.guild) {
      embed.addField('ERROR', "You do not have permission for this command!")
    } else {
      embed.addField('ERROR', 'You must be in a discord guild to run this command!')
    }
    return message.channel.send({ embed }).catch(console.error);
  }

  if (!ticketId) {
    embed.setColor('RED')
    embed.addField('ERROR', 'Please specify a ticket number to close!')
    if (message.guild) {
      return message.channel.send({ embed }).catch(console.error);
    } else {
      return message.author.send({ embed }).catch(console.error);
    }
  }

  try {
    const ticket = await Ticket.findOne({ number: ticketId });

    if (['open', 'hold'].includes(ticket.status)) {
      await Ticket.findOneAndUpdate({ number: ticketId }, {
        $set: { status: 'closed', solution: solution.join(' ') }
      });
      embed.setColor('GREEN');
      embed.addField('Closed Ticket', ticket.number);
      if (message.guild) {
        message.channel.send({ embed });
      } else {
        message.author.send({ embed });
      }

      const user = await User.findOne({ 'ticketNums': { $in: [ticketId] } });
      const discordUser = message.client.users.cache.get(user.discordId)
      return discordUser.send([
        `Your ticket with ID ${ticketId} has been closed.`,
        'Provided solution:',
        '```' + solution + '```'
      ]).catch(console.error);
    } else {
      return message.reply(`Ticket ${ticketId} is already closed.`);
    }
  } catch(ex) {
    console.trace(ex);
    embed.setColor('RED');
    embed.addField('Error', `Could not close ticket no. ${ticketId}.`);
    return message.reply(embed);
  }


}