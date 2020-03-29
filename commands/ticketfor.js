const Discord = require("discord.js");
const {createChannel, initialChecks} = require("../helpers");

module.exports.run = async (bot, message, args, prefix, staffrole, adminrole, client) => {

    // Perform checks for staff role, blacklist & ticket-log channel
    if (initialChecks(message, staffrole) !== 2) return;

    // Check if the author is a staff member
    if (message.member.roles.cache.find(role => role.name === staffrole) === undefined) return message.channel.send("Sorry, you can't create a ticket for someone else.");

    // Get the mentioned user
    var mention = message.mentions.users.first();
    if(mention === undefined) return message.channel.send("Please mention a user.");

    let staffId = message.guild.roles.cache.find(role => role.name === staffrole);
    let reason = (args[1] !== undefined) ? args.join(" ").substring(22) : "Not defined";

    // Log the ticket creation to the database
    let query = 'INSERT INTO ticket_log(author, ticketfor, reason, opened_at, open) VALUES($1, $2, $3, $4, $5) RETURNING *'
    let values = [message.author.id, mention.id, (reason === 'Not defined') ? undefined : reason, message.createdAt, true]
    
    // Set the Ticket ID
    let ticketEntry = await client.one(query, values);
    let ticketID = parseInt(ticketEntry.id);
    let ticketName = 'ticket_' + ticketID;

    let initialMsgs = [
        new Discord.MessageEmbed()
            .setDescription(`Hey, ${mention}!\n${message.author} has created a support ticket for you!\nOur support team will be here shortly!\n\nKind Regards,\nAmbyre Nodes Staff`)
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
        .setFooter("User ID: " + mention.id);

    // Log the creation into the ticket log
    createChannel(message, ticketName, staffId, initialMsgs, logEmbed, client, reason, mention.id);
}

module.exports.help = {
    name: "ticketfor"
}
