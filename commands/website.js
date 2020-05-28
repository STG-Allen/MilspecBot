const Discord = require ('discord.js');

module.exports = {
    name: 'website',
    description: 'Display the MilspecSG website',
    execute(message) {
        let embed = new Discord.MessageEmbed()
        .setAuthor("MilspecSG")
        .setColor('#0099ff')
        .addField('URL', 'http://www.milspecsg.rocks/')
        .setFooter('Created by Milspec Dev Team');
    message.channel.send({embed: embed});
    }
};