import Discord from "discord.js";
import Ticket from '../../model/ticket';


export default async function info(message: Discord.Message, ...args: string[]) {
  const embed = new Discord.MessageEmbed().setTitle('Ticket');
  let [, ticketNum] = args;

  if (ticketNum.length < 1) {
    return message.channel.send('No such ticket.').catch(console.error);
  }

  try {
    const ticket = await Ticket.findOne({ number: ticketNum });
    embed.setColor('GREEN')
    embed.addField('Issue', ticket.description)

    if (ticket.comment.length < 1) {
      embed.addField('Comments: ', 'None')
    } else {
      ticket.comment.forEach((el, index)=> {
        embed.addField(`Comment ${index + 1}`, `${el.comment}\n\nAuthor: ${el.author}`);
      });
    }

    embed.addField('Status', ticket.status)
    embed.addField('Created: ', ticket.createdUtc)
    if (message.guild !== null) {
      message.channel.send('Please check your DM\'s, I sent you a message regarding that ticket!')
    }
    return message.author.send({ embed: embed })

  } catch(ex) {
    console.trace(ex);
    return message.channel.send([
      'Your ticket could not be found!',
      'If your ticket ID is correct and the issue persists, please contact an administrator!'
    ]);
  }

}