const Discord = require("discord.js");
var randomstring = require("randomstring");
const fs = require("fs");
const {createChannel, initialChecks} = require("../helpers");

module.exports.run = async (bot, message, args, prefix, staffrole, adminrole, client) => {

    // Perform checks for staff role, blacklist & ticket-log channel
    if (initialChecks(message, staffrole) !== 2) return;

    let staffId = message.guild.roles.cache.find(role => role.name === staffrole);
    let reason = (args[0] !== undefined) ? args.join(" ") : "Not defined";
    
    // Log the ticket creation to the database
    query = 'INSERT INTO ticket_log(author, reason, opened_at, open) VALUES($1, $2, $3, $4) RETURNING *'
    values = [message.author.id, (reason === 'Not defined') ? undefined : reason, message.createdAt, true]
    
    let ticketEntry = await client.one(query, values);
    let ticketID = parseInt(ticketEntry.id);
    let ticketName = 'ticket_' + ticketID;

    let initialMsgs = [
        new Discord.MessageEmbed()
            .setDescription(`Hey, ${message.author}!\nThanks for opening a support ticket!\nOur support team will be here shortly!\n\nKind Regards,\nAmbyre Nodes Staff`)
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
        .addField("Created At:", `${message.createdAt}`, false)
        .addField("Reason:", `${reason}`, false)
        .setFooter("User ID: " + message.author);

    createChannel(message, ticketName, staffId, initialMsgs, logEmbed, client, reason);
}

module.exports.help = {
    name: "newticket"
}
