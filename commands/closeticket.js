const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args, prefix, staffrole, adminrole, client) => {

    let channel = message.channel;
    let channelName = message.channel.name;
    let ticketlogCh = message.guild.channels.cache.find(ch => ch.name === 'ticket-log');
    let closedAt = message.createdAt;

    // Check if user closing ticket is a staff
    if(message.member.roles.cache.find(role => role.name === staffrole) === undefined) return message.channel.send("You do not have the permission to close a ticket. If you want one of your tickets to be closed please contact a staff.")

    if(!message.channel.name.startsWith("ticket") || message.channel.name == "ticket-log" || message.channel.name == "ticket-help" || message.channel.name == "ticket-commands") {
        return message.channel.send("You are not in a ticket channel! Tickets can only be closed in the channel itself.");
    }

    let reason = (args[0] !== undefined) ? args.join(" ") : "Not defined";

    // Yeet the channel
    channel.delete('Ticket Closed')
        .then(() => {

            // Update DB
            let query = 'UPDATE ticket_log SET open = false, closed_at = $1 WHERE id = $2'
            let values = [message.createdAt, parseInt(channelName.substring(7))]
            client.none(query, values)
                .catch(console.error);

            // Log the deletion of ticket into the log channel
            let closeTicket = new Discord.MessageEmbed()
                .setDescription("**Ticket Closed**")
                .setColor("#ed3434")
                .addField("Ticket Closed by:", `${message.author}`, true)
                .addField("Ticket-ID:", `${channelName}`, true)
                .addField("Closed At:", `${closedAt}`, false)
                .addField("Closing Reason:", `${reason}`, false);
                ticketlogCh.send(closeTicket);

        })
        .catch(console.error);

    

}

module.exports.help = {
    name: "closeticket"
}
