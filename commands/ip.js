const Discord = require('discord.js');

module.exports = {
    name: 'ip',
    description: 'Display all server ip\'s for MilspecSG',
    execute(message) {
        let embed = new Discord.MessageEmbed()
        .setColor('0099ff')
        .addField('Server-IP', '<#701560784144171078>')
        .setFooter('Creaded by Milspec Dev Team');
    message.channel.send({embed: embed})
    } 
};