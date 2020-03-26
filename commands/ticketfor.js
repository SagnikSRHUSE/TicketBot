const Discord = require("discord.js");
var randomstring = require("randomstring");
const fs = require("fs");
const {createChannel, initialChecks} = require("../helpers");

module.exports.run = async (bot, message, args, prefix, staffrole, adminrole) => {

    // Perform checks for staff role, blacklist & ticket-log channel
    if (initialChecks(message, staffrole) !== 2) return;

    // Get the mentioned user
    if(!message.mentions.users.first()) return message.channel.send("Please mention a user.");
    var mention = message.mentions.users.first().id;

    let staffId = message.guild.roles.cache.find(role => role.name === staffrole);

    let ticketID = randomstring.generate({
        length: 5,
        capitalization: 'lowercase'
    });
    let ticketName = 'ticket-' + ticketID;

    // Cancel if the channel with that name already exists
    let temp = message.guild.channels.cache.find(ch => ch.name === ticketName);
    if (temp !== undefined) {
        return message.channel.send('Please execute the command again.');
    }

    let reason = (args[1] !== undefined) ? args.join(" ").substr(22) : "Not defined";

    let initialMsgs = [
        new Discord.MessageEmbed()
            .setDescription(`Hey, ${mention}!\n${message.author} has created a support ticket!\nOur support team will be here shortly!\n\nKind Regards,\nAmbyre Nodes Staff`)
            .setColor("#74A33B")
            .addField("Ticket-ID", ticketName, true)
            .addField("Reason", reason, true),
        `(${staffId}) Attention! ${message.author} has just opened a support ticket!`
    ]

    let logEmbed = new Discord.MessageEmbed()
        .setDescription("**Ticket Created**")
        .setColor("#3def15")
        .addField("Created by:", `${message.author}`, true)
        .addField("Ticket-ID:", `${ticketName}`, true)
        .addField("Created for:", `${mention}`, true)
        .addField("Created At:", `${message.createdAt}`, false)
        .addField("Reason:", `${reason}`, false)
        .setFooter("User ID: " + mention);

    // Log the creation into the ticket log
    createChannel(message, ticketName, staffId, initialMsgs, logEmbed, mention);
}

module.exports.help = {
    name: "ticketfor"
}
