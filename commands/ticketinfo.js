const Discord = require("discord.js");

module.exports.run = async (bot, message, args, con, prefix, tcMessage, staffrole, adminrole) => {

    var str = args[0];

    if(!message.member.roles.find("name", staffrole)) return message.channel.send("You do not have the permission to use this command.")

    if(str.startsWith("ticket-")){
        con.query(`SELECT * FROM tickets WHERE ticketID = '${str}'`, (err, rows) => {
            if(err) throw err;

            if(rows.length < 1){
                message.channel.send("Invalid ID. Format: `ticket-ID` or `ID`");
            } else {
                let ticketID = rows[0].ticketID;
                let ticketAuthor = rows[0].ticketAuthor;
                let ticketFor = rows[0].ticketFor;
                let status = rows[0].status;
                let reason = rows[0].reason;
                let createdAt = rows[0].createdAt;
                let closedAt = rows[0].closedAt;
                let closeReason = rows[0].closeReason;

                var ticketInfoEmbed = new Discord.RichEmbed()
                .setDescription("**Ticket Info**")
                .setColor("#d2d8e0")
                .addField("Ticket-ID:", `${ticketID}`, true)
                .addField("Created By:", `${ticketAuthor}`, true)
                .addField("Created For:", `${ticketFor}`, true)
                .addField("Status:", `${status}`, true)
                .addField("Reason:", `${reason}`, true)
                .addField("Created At:", `${createdAt}`, true)
                .addField("Closed At:", `${closedAt}`, true)
                .addField("Close Reason:", `${closeReason}`, true)
                .setFooter("ZadeServers Tickets");
                message.channel.send(ticketInfoEmbed);
            }

        });
    } else {
        var tstr = "ticket-" + str;
        con.query(`SELECT * FROM tickets WHERE ticketID = '${tstr}'`, (err, rows) => {
            if(err) throw err;

            if(rows.length < 1){
                message.channel.send("Invalid ID. Format: `ticket-ID` or `ID`");
            } else {
                let ticketID = rows[0].ticketID;
                let ticketAuthor = rows[0].ticketAuthor;
                let ticketFor = rows[0].ticketFor;
                let status = rows[0].status;
                let reason = rows[0].reason;
                let createdAt = rows[0].createdAt;
                let closedAt = rows[0].closedAt;
                let closeReason = rows[0].closeReason;

                var ticketInfoEmbed = new Discord.RichEmbed()
                .setDescription("**Ticket Info**")
                .setColor("#d2d8e0")
                .addField("Ticket-ID:", `${ticketID}`, true)
                .addField("Created By:", `${ticketAuthor}`, true)
                .addField("Created For:", `${ticketFor}`, true)
                .addField("Status", `${status}`, true)
                .addField("Reason", `${reason}`, true)
                .addField("Created At:", `${createdAt}`, true)
                .addField("Closed At:", `${closedAt}`, true)
                .addField("Close Reason:", `${closeReason}`, true)
                .setFooter("ZadeServers Tickets");
                message.channel.send(ticketInfoEmbed);
            }

        });
    }
    
}

module.exports.help = {
    name: "ticketinfo"
}