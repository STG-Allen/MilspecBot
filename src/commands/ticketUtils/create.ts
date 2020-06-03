import Discord from "discord.js";
import config from '../../config';
import User from '../../model/user';
import Ticket from '../../model/ticket';

export default async function create(message: Discord.Message, ...args: string[]) {
  const { logChannel, prefix } = await config;
  const embed = new Discord.MessageEmbed().setTitle('Ticket');
  const [, ...params] = args;
  const logTo = message.client.channels.cache.get(logChannel) as Discord.TextChannel;
  const desc = params.join(' ');
  if (desc.length < 10) {
    embed.setColor('RED');
    embed.addField('Error', 'Please specify a reason for creating the ticket.');
    return message.reply({ embed: embed });
  }
  let ticketCount = await Ticket.countDocuments({});

  const doc = await User.findOne({userName: message.author.tag});
  if (doc) {
    ticketCount++;
    // TODO: Wrap the awaited promises in a try catch block and handle errs.
    const ticket = await new Ticket({
      number: ticketCount,
      description: desc,
      comment: [],
      createdUtc: Date.now(),
      status: 'open',
      solution: 'none'
    }).save();

    await User.findOneAndUpdate(
      { userName: message.author.tag },
      { $addToSet: { ticketNums: ticketCount.toString() } },
      { new: true });

    embed.setColor('GREEN')
    embed.addField('Success', [
      `You have created a ticket with description: \`\`${desc}\`\``,
      `with id \`\`${ticket.number}\`\`.`,
      `Please do not submit multiple tickets for the same issue.'`
    ]);

    message.author.send({ embed }).catch(console.error);

    let logEmbed = new Discord.MessageEmbed()
      .setTitle('New Ticket!')
      .setColor('GREEN')
      .addField(message.author.tag, [
        `Created a new ticket with ID: \`\` ${ticket.number}.\`\``,
        `You can now view this ticket with \`\`${prefix}ticket info ${ticket.number}\`\``
      ])
      .addField('Preview', ticket.description);

    return logTo.send({ embed: logEmbed });
  } else {
    ticketCount++;
    logTo.send(`Creating a new entry for ${message.author.tag} in the database!`);
    try {
      const ticket = await new Ticket({
        number: ticketCount,
        description: desc,
        comment: [],
        createdUtc: Date.now(),
        status: 'open',
        solution: 'none'
      }).save();

      await new User({
        userName: message.author.tag,
        ticketNums: ticket.number,
        discordId: message.author.id
      }).save();

      embed.setColor('GREEN')
      embed.addField('Success', [
        `You have created a ticket with description:\`\`${desc}.`,
        `Please do not submit multiple tickets for the same issue.`
      ]);
      message.author.send({ embed: embed }).catch(console.error);
      let logEmbed = new Discord.MessageEmbed()
        .setTitle('New Ticket!')
        .setColor('GREEN')
        .addField(message.author.tag, [
          `Created a new ticket with ID: \`\` ${ticket.number}.\`\``,
          `You can now view this ticket with \`\`${prefix}ticket info ${ticket.number}\`\``
        ]);
      return logTo.send({ embed: logEmbed })
    } catch(ex) {
      console.trace(ex)
      embed.setColor('RED')
      embed.addField('ERROR', 'We were unable to create your ticket, please contact an administrator!')
    }
  }
}