import Discord from 'discord.js';

const name = 'website';
const description = 'Display the MilspecSG website';

function execute(message: Discord.Message) {
  const embed = new Discord.MessageEmbed()
    .setAuthor("MilspecSG")
    .setColor('#0099ff')
    .addField('URL', 'http://www.milspecsg.rocks/')
    .setFooter('Created by Milspec Dev Team');
  message.channel.send({ embed });
}

export { name, description, execute }