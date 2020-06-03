import Discord from "discord.js";
import User from '../../model/user';

export default async function list(message: Discord.Message, ...args: string[]) {
  const embed = new Discord.MessageEmbed().setTitle('Ticket');
  const [, ...params] = args;

  let userId = params[0] ?? 'self';

  // TODO: Explore a String#match solution like userId = userId.match(/\d/g);
  if (userId?.startsWith('<@') && userId?.endsWith('>')) {
    userId = userId.slice(2, -1);
    if (userId?.startsWith('!')) {
      userId = userId.slice(1);
    }
  }

  const userIsStaff = message.member.roles.cache.some(r => r.name === 'Staff');

  if ((message.guild && userIsStaff) || (userId === 'self') || !params[0]) {

    if (!params[0] || params[0] === 'self') {
      userId = message.author.id
    }
    try {
      const result = await User.findOne({ discordId: userId });
      embed.setColor('GREEN');
      if (!result) {
        embed.addField(result.userName, 'Does not have any active tickets!')
        message.author.send({ embed })
      }
      if (message.guild !== null) {
        message.channel.send([
          'Please check your DM\'s.',
          'I sent you a list of tickets pertaining to the specified user.'
        ]);
      }
      embed.setTitle(result.userName + '\'s Tickets')
      embed.addField('Tickets:', result.ticketNums)
      return message.author.send({ embed })
    } catch(ex) {
      console.trace(ex);
    }
  } else {
    embed.setColor('RED')
    if (message.guild !== null) {
      embed.addField('ERROR', "You do not have permission for this command!")
    } else {
      embed.addField('ERROR', 'You must be in a discord guild to run this command!')
    }
    message.channel.send({ embed })
  }




}