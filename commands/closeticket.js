const Discord = require("discord.js");

module.exports.run = async (bot, message, args, con, prefix, tcMessage, staffrole, adminrole) => {

    let channel = message.channel;
    let channelName = message.channel.name;
    var ticketlog = message.guild.channels.find("name", "ticket-log");
    let closedAt = message.createdAt;

    con.query(`SELECT * FROM tickets WHERE ticketID = '${channelName}'`, (err, rows) => {

        if(err) throw err;

        if(!message.member.roles.find("name", staffrole)) return message.channel.send("You do not have the permission to close a ticket. If you want one of your tickets to be closed please contact a staff.")

        if(rows.length < 1) {
            message.channel.send("You are not in a ticket channel! Tickets can only be closed in the channel itself.");

        } else {

            if(!args[0]){

                let changeStatus;
                changeStatus = `UPDATE tickets SET status = 'closed' WHERE ticketID = '${channelName}'`;
                con.query(changeStatus);
    
                channel.delete();
    
                var closeTicket = new Discord.RichEmbed()
                  .setDescription("**Ticket Closed**")
                  .setColor("#ed3434")
                  .addField("Ticket Closed by:", `${message.author}`, true)
                  .addField("Closed At:", `${closedAt}`, true)
                  .addField("Ticket-ID:", `${channelName}`, true);
                ticketlog.send(closeTicket);

            } else {

                let changeStatus;
                changeStatus = `UPDATE tickets SET status = 'closed' WHERE ticketID = '${channelName}'`;
                con.query(changeStatus);
    
                channel.delete();

                let closeReason = args.join(" ");
                if (closeReason.contains("'")) closeReason.replace("'", "");
                con.query(`UPDATE tickets SET closeReason = '${closeReason}' WHERE ticketID = '${channelName}'`);
    
                var closeTicket = new Discord.RichEmbed()
                  .setDescription("**Ticket Closed**")
                  .setColor("#ed3434")
                  .addField("Ticket Closed by:", `${message.author}`, true)
                  .addField("Closed At:", `${closedAt}`, true)
                  .addField("Ticket-ID:", `${channelName}`, true);
                ticketlog.send(closeTicket);

            }

        }
    });

}

module.exports.help = {
    name: "closeticket"
}