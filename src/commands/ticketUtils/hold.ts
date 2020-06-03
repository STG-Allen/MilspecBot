import Discord from "discord.js";
import Ticket from '../../model/ticket';
import User from '../../model/user';

export default async function hold(message: Discord.Message, ...args: string[]) {
  const embed = new Discord.MessageEmbed().setTitle('Ticket');
  const authorIsStaff = message.member.roles.cache.some(role => role.name === 'Staff');

  const [, ticketId] = args;

  if (!(message.guild && authorIsStaff)) {
    embed.setColor('RED');
    if (message.guild !== null) {
      embed.addField('ERROR', "You do not have permission for this command!");
    } else {
      embed.addField('ERROR', 'You must be in a discord guild to run this command!');
    }
    return message.channel.send({ embed }).catch(console.error);
  }

  if (!ticketId) {
    embed.setColor('RED');
    embed.addField('ERROR', 'Please specify a ticket number to hold!');
    if (message.guild) {
      message.channel.send({ embed }).catch(console.error);
    } else {
      message.author.send({ embed }).catch(console.error);
    }
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
    if (message.guild) {
      message.channel.send({ embed }).catch(console.error);
    } else {
      message.author.send({ embed }).catch(console.error);
    }

    const user = await User.findOne({ 'ticketNums': { $in: [ticketId] } });

    const discordUser = message.client.users.cache.get(user.discordId)
    return discordUser.send(`Your ticket with Id \`\`${ticketId}\`\` has been held.`)
      .catch(console.error);


  } catch(ex) {

  }

}