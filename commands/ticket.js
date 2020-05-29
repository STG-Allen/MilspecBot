const Discord = require('discord.js')
const mongoose = require('mongoose')
const { userName, password, dbName, port, hostName, useAuth, logChannel } = require('../config.json')
let db = undefined
let ticketCount = undefined;

if (!useAuth) {
    db = mongoose.connect('mongodb://localhost:27017/' + dbName, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
} else {
    db = mongoose.connect('mongodb://' + userName + ':' + password + '@' + hostName + ':' + port + '/' + dbName, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}
const User = require('../model/user.js')
const Ticket = require('../model/ticket.js')
const Comment = require('../model/comment.js')

module.exports = {
    name: 'ticket',
    description: 'Create, view and comment on tickets',
    execute(message, args) {
        message.delete
        let embed = new Discord.MessageEmbed()
            .setTitle('Ticket');

        if (args[0] === 'create') {
            args.shift()
            let description = args.join(' ')
            if (description !== '') {
                Ticket.countDocuments({}, function (err, count) {
                    if (err) {
                        console.error(err)
                    } else {
                        ticketCount = count;
                    }
                });
                User.findOne({ userName: message.author.tag }, function (err, doc) {
                    if (doc) {
                        ticketCount++
                        let ticket = new Ticket({
                            number: ticketCount,
                            description: description,
                            comment: [],
                            createdUtc: Date.now(),
                            status: 'open',
                            solution: 'none'
                        })
                        ticket.save((err, ticket) => {
                            User.findOneAndUpdate({ userName: message.author.tag },
                                { $addToSet: { ticketNums: ticketCount } }, { new: true }, function (err, doc) {
                                    if (err) {
                                        console.error(err)
                                    }
                                })
                            embed.setColor('GREEN')
                            embed.addField('Success', 'You have created a ticket with description: ``' + description
                                + '`` with id ``' + ticket.number + '``. Please do not submit multiple tickets for the same issue.')
                            message.author.send({ embed: embed })

                            let logEmbed = new Discord.MessageEmbed()
                                .setTitle('New Ticket!')
                                .setColor('GREEN')
                                .addField(message.author.tag, 'Created a new ticket with ID: ``' + ticket.number + '``. \nYou can now view this ticket with ``!?ticket info ' + ticket.number + '``')
                                .addField('Preview', ticket.description)
                            message.client.channels.cache.get(logChannel).send({ embed: logEmbed })
                        })

                    } else {
                        ticketCount++
                        let ticket = new Ticket({
                            number: ticketCount,
                            description: description,
                            comment: [],
                            createdUtc: Date.now(),
                            status: 'open',
                            solution: 'none'
                        })
                        message.client.channels.cache.get(logChannel).send("Creating a new entry for " + message.author.tag + " in the database!")
                        ticket.save((err, ticket) => {
                            if (err) {
                                console.log(err)
                                embed.setColor('RED')
                                embed.addField('ERROR', 'We were unable to create your ticket, please contact an administrator!')
                            } else {
                                let user = new User({
                                    userName: message.author.tag,
                                    ticketNums: ticket.number,
                                    discordId: message.author.id
                                })
                                user.save()
                                    .then(doc => {
                                        embed.setColor('GREEN')
                                        embed.addField('Success', 'You have created a ticket with description: ``' + description
                                            + '``. Please do not submit multiple tickets for the same issue.')
                                        message.author.send({ embed: embed })
                                        let logEmbed = new Discord.MessageEmbed()
                                            .setTitle('New Ticket!')
                                            .setColor('GREEN')
                                            .addField(message.author.tag, 'Created a new ticket with ID: ``' + ticket.number + '``. \nYou can now view this ticket with ``!?ticket info ' + ticket.number + '``')
                                        message.client.channels.cache.get(logChannel).send({ embed: logEmbed })
                                    }).catch(err => {
                                        embed.setColor('RED')
                                        embed.addField('ERROR', 'There was an error creating your ticket! Please contact an admin.')
                                        message.author.send({ embed: embed })
                                        console.error(err)
                                    })
                            }
                        })
                    }
                })
            } else {
                embed.setColor('RED')
                embed.addField('Error', 'Please specify a reason for creating the ticket.')
                message.reply({ embed: embed })
            }
        }

        if (args[0] === 'list') {
            args.shift()
            let userId = 'self'
            if (args[0]) {
                userId = args[0]

                if (userId && (userId.startsWith('<@') && userId.endsWith('>'))) {
                    userId = userId.slice(2, -1);

                    if (userId.startsWith('!')) {
                        userId = userId.slice(1);
                    }
                }
            }

            if ((message.guild !== null && message.member.roles.cache.some(role => role.name === 'Staff')) || userId === 'self' || !args[0]) {
                if (!args[0] || args[0] === 'self') {
                    userId = message.author.id
                }
                User.findOne({ discordId: userId }, function (err, result) {
                    if (!err) {
                        embed.setColor('GREEN')
                        if (!result) {
                            embed.addField(result.userName, 'Does not have any active tickets!')
                            message.author.send({ embed: embed })
                        }
                        if (message.guild !== null) {
                            message.channel.send('Please check your DM\'s. I sent you a list of tickets pertaining to the specified user.')
                        }
                        embed.setTitle(result.userName + '\'s Tickets')
                        embed.addField(result.ticketNums)
                        message.author.send({ embed: embed })
                    } else {
                        console.error(err)
                    }
                })
            } else {
                embed.setColor('RED')
                if (message.guild !== null) {
                    embed.addField('ERROR', "You do not have permission for this command!")
                } else {
                    embed.addField('ERROR', 'You must be in a discord guild to run this command!')
                }
                message.channel.send({ embed: embed })
            }
        }

        if (args[0] === 'info') {
            args.shift()
            let ticketNum = args[0]

            if (ticketNum !== '') {
                Ticket.findOne({ number: ticketNum }, function (err, ticket) {
                    if (err) {
                        console.error(err)
                    } else {
                        embed.setColor('GREEN')
                        embed.addField('Issue', ticket.description)
                        if (ticket.comment == '') {
                            embed.addField('Comments: ', 'None')
                        } else {
                            let count = 1
                            ticket.comment.forEach(element => {
                                embed.addField('Comment ' + count, element.comment + '\n\nAuthor: ' + element.author)
                                count++
                            })
                        }
                        embed.addField('Status', ticket.status)
                        embed.addField('Created: ', ticket.createdUtc)
                        if (message.guild !== null) {
                            message.channel.send('Please check your DM\'s, I sent you a message regarding that ticket!')
                        }
                        message.author.send({ embed: embed })
                    }
                })
            }
        }

        if (args[0] === 'comment') {
            if (message.guild !== null && message.member.roles.cache.some(role => role.name === 'Staff')) {
                args.shift()
                if (!args[0]) {
                    embed.color('RED')
                    embed.addField('ERROR', 'Please specify a ticket to comment upon!')
                    message.channel.send({ embed: embed })
                } else {
                    let ticketNum = args[0]
                    args.shift()
                    if (!args[0]) {
                        embed.color('RED')
                        embed.addField('ERROR', 'Please specify a comment!')
                        message.channel.send({ embed: embed })
                    } else {
                        let comment = args.join(' ')

                        let commentModel = new Comment({
                            comment: comment,
                            author: message.author.tag
                        })

                        Ticket.findOneAndUpdate({number: ticketNum}, {
                            $addToSet: { comment: commentModel }
                        },
                            function (err, ticket) {
                                if (err) {
                                    console.error(err)
                                } else {
                                    embed.setColor('GREEN')
                                    embed.addField('Update', 'Sucessfully added comment ``' + comment + '`` to the ticket with id ``' + ticketNum + '``')
                                    message.channel.send({ embed: embed })
                                }
                            })
                        User.findOne({ 'ticketNums': { $in: ticketNum } }, function (err, user) {
                            if (err) {
                                console.error(err)
                            } else {
                                const discordUser = message.client.users.cache.get(user.discordId)
                                discordUser.send('Your ticket with Id ``' + ticketNum + '`` has been updated with comment ``' + comment + '``.')
                            }
                        })
                    }
                }
            } else {
                embed.setColor('RED')
                if (message.guild !== null) {
                    embed.addField('ERROR', "You do not have permission for this command!")
                } else {
                    embed.addField('ERROR', 'You must be in a discord guild to run this command!')
                }
                message.channel.send({ embed: embed })
            }
        }

        if (args[0] === 'close') {
            if (!(message.guild !== null && message.member.roles.cache.some(role => role.name === 'Staff'))) {
                embed.setColor('RED')
                if (message.guild !== null) {
                    embed.addField('ERROR', "You do not have permission for this command!")
                } else {
                    embed.addField('ERROR', 'You must be in a discord guild to run this command!')
                }
                message.channel.send({ embed: embed })
            } else {
                args.shift()

                if (!args[0]) {
                    embed.setColor('RED')
                    embed.addField('ERROR', 'Please specify a ticket number to close!')
                    if (message.guild !== null) {
                        message.channel.send({ embed: embed })
                    } else {
                        message.author.send({ embed: embed })
                    }
                } else {
                    let ticketNum = args[0]
                    args.shift()

                    let solution = 'unknown'
                    if (args[0]) {
                        solution = args.join(' ')
                    }

                    Ticket.findOne({ number: ticketNum }, function (err, ticket) {
                        if (!err) {
                            if (ticket.status === 'open' || ticket.status === 'hold') {
                                Ticket.findOneAndUpdate({ number: ticketNum }, {
                                    $set: { status: 'closed', solution: solution }
                                }, function (err, ticket) {
                                    if (!err) {
                                        embed.setColor('GREEN')
                                        embed.addField('Closed Ticket', ticket.number)
                                        if (message.guild !== null) {
                                            message.channel.send({ embed: embed })
                                        } else {
                                            message.author.send({ embed: embed })
                                        }
                                    } else {
                                        console.error(err)
                                    }
                                })
                                User.findOne({ 'ticketNums': { $in: ticketNum } }, function (err, user) {
                                    if (!err) {
                                        const discordUser = message.client.users.cache.get(user.discordId)
                                        discordUser.send('Your ticket with Id ``' + ticketNum + '`` has been closed with solution ``' + solution + '``.')
                                    } else {
                                        console.error(err)
                                    }
                                })
                            }
                        } else {
                            console.error(err)
                        }
                    })
                }
            }
        }

        if (args[0] === 'hold') {
            if (!(message.guild !== null && message.member.roles.cache.some(role => role.name === 'Staff'))) {
                embed.setColor('RED')
                if (message.guild !== null) {
                    embed.addField('ERROR', "You do not have permission for this command!")
                } else {
                    embed.addField('ERROR', 'You must be in a discord guild to run this command!')
                }
                message.channel.send({ embed: embed })
            } else {
                args.shift()
                if (!args[0]) {
                    embed.setColor('RED')
                    embed.addField('ERROR', 'Please specify a ticket number to hold!')
                    if (message.guild !== null) {
                        message.channel.send({ embed: embed })
                    } else {
                        message.author.send({ embed: embed })
                    }
                } else {
                    Ticket.findOne({ number: ticketNum }, function (err, ticket) {
                        if (!err) {
                            if (ticket.status === 'hold') {
                                Ticket.findOneAndUpdate({ number: ticketNum }, {
                                    $set: { status: 'hold' }
                                }, function (err, ticket) {
                                    if (!err) {
                                        embed.setColor('GREEN')
                                        embed.addField('Held Ticket', ticket.number)
                                        if (message.guild !== null) {
                                            message.channel.send({ embed: embed })
                                        } else {
                                            message.author.send({ embed: embed })
                                        }
                                    } else {
                                        console.error(err)
                                    }
                                })
                                User.findOne({ 'ticketNums': { $in: ticketNum } }, function (err, user) {
                                    if (!err) {
                                        const discordUser = message.client.users.cache.get(user.discordId)
                                        discordUser.send('Your ticket with Id ``' + ticketNum + '`` has been held.')
                                    } else {
                                        console.error(errr)
                                    }
                                })
                            }
                        } else {
                            console.error(err)
                        }
                    })
                }
            }
        }
    }
}
