import Discord from "discord.js";
import Ticket from '../../model/ticket';
import Comment from '../../model/comment';
import User from '../../model/user';

export default async function comment(message: Discord.Message, ...args: string[]) {
  const embed = new Discord.MessageEmbed().setTitle('Ticket');
  const [, ticketId, commentId, ...rest] = args;

  if (message.guild &&
    message.member.roles.cache.some(role => role.name === 'Staff')) {

    if (!ticketId) {
      embed.setColor('RED')
      embed.addField('ERROR', 'Please specify a ticket to comment upon!')
      return message.channel.send({ embed: embed })
    }
    if (!commentId) {
      embed.setColor('RED')
      embed.addField('ERROR', 'Please specify a comment!')
      return message.channel.send({ embed: embed });
    }

    const comment = rest.join(' ');
    const commentModel = new Comment({ comment, author: message.author.tag });

    try {
      await Ticket.findOneAndUpdate({ number: ticketId }, {
        $addToSet: { comment: commentModel }
      });
    } catch(ex) {
      console.trace(ex);
      embed.setColor('RED');
      embed.setDescription([
        'Something went catastrophically wrong while adding your comment.',
        'Please contact an administrator if the problem persists.'
      ]);
      return message.channel.send({ embed });
    }

    embed.setColor('GREEN')
    embed.addField('Update', [
      `Comment \`\`${comment}\`\` successfully added to the ticket with id ${ticketId}`
    ]);
    message.channel.send({ embed })

    try {
      const user = await User.findOne({ 'ticketNums': { $in: [ticketId] } });
      const discordUser = message.client.users.cache.get(user.discordId)
      return discordUser.send([
        `Your ticket with ID \`\`${ticketId}\`\` has been updated with comment:`,
        '``' + comment + '``'
      ]);
    } catch(ex) {
      console.trace(ex);
    }

  } else {
    embed.setColor('RED')
    if (message.guild) {
      embed.addField('ERROR', "You do not have permission for this command!")
    } else {
      embed.addField('ERROR', 'You must be in a discord guild to run this command!')
    }
    return message.channel.send({ embed: embed })
  }


}