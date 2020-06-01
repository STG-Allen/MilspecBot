import Discord from 'discord.js';

const name = 'ip';
const description = 'Display all server ip\s for MilspecSG';

function execute(message: Discord.Message) {
  const embed = new Discord.MessageEmbed()
    .setColor('0099ff')
    .addField('Server-IP', '<#701560784144171078>')
    .setFooter('Created by Milspec Dev Team');
  message.channel.send({ embed });
}

export { name, description, execute }