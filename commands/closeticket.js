const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, tcMessage, staffrole, adminrole) => {

    let channel = message.channel;
    let channelName = message.channel.name;
    var ticketlog = message.guild.channels.find("name", "ticket-log");
    let closedAt = message.createdAt;

    if(!message.member.roles.find("name", staffrole)) return message.channel.send("You do not have the permission to close a ticket. If you want one of your tickets to be closed please contact a staff.")

    if(rows.length < 1) {
        message.channel.send("You are not in a ticket channel! Tickets can only be closed in the channel itself.");

    } else {

        if(!args[0]){    
            channel.delete();
            var closeTicket = new Discord.RichEmbed()
              .setDescription("**Ticket Closed**")
              .setColor("#ed3434")
              .addField("Ticket Closed by:", `${message.author}`, true)
              .addField("Closed At:", `${closedAt}`, true)
              .addField("Ticket-ID:", `${channelName}`, true)
              .addField("Closing Reason:", `Not defined`, true);
            ticketlog.send(closeTicket);

        } else {    
            channel.delete();
            let closeReason = args.join(" ");
            var closeTicket = new Discord.RichEmbed()
              .setDescription("**Ticket Closed**")
              .setColor("#ed3434")
              .addField("Ticket Closed by:", `${message.author}`, true)
              .addField("Closed At:", `${closedAt}`, true)
              .addField("Ticket-ID:", `${channelName}`, true)
              .addField("Closing Reason:", `${closeReason}`, true);
            ticketlog.send(closeTicket);

        }

    }

}

module.exports.help = {
    name: "closeticket"
}
