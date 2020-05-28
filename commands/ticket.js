const Discord = require('discord.js');
const fs = require('fs');


var userTickets = new Map();
let ticketCount = 0;


module.exports = {
    name: 'ticket',
    description: 'MilspecSG Discord Tickets',
    execute(client, message, args) {
        console.log(args)
        if (args.includes('create')) {
            args.shift();
            var reason = args.join(' ')
            console.log('\"' + reason + '\"');
            if (reason === ' ' || reason === '  ' || reason === '') {
                message.author.send('Please specify a reason! Reply with !?ticket create <reason>');
            } else {
                userTickets.set(ticketCount, message.author.username);
                process(reason, ticketCount, client, message.author);
                ticketCount++;
                console.log('Ticket Count: ' + ticketCount);
            }
        } else {
            console.log('No algorithm found. Args: ' + args)
        }
    }
};

function process (ticket, ticketNum, client, author) {
    console.log('Processing ' + ticket +  ' num ' + ticketNum);
    author.send('You have successfully created a ticket! The number is : ' + ticketNum + ' with reason \"' + ticket + '\"')
}