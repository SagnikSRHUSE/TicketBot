const Discord = require("discord.js");

module.exports.run = async (bot, message, args, con) => {

    message.channel.send("Creating Ticket...");

    con.query(`SELECT count FROM counter`, (err, rows) => {

        //Counter
        if(err) throw err;

        let count;
        let c = rows[0].count;

        count = `UPDATE counter SET count = ${c + 1}`;

        con.query(count);

        //Creation of Ticket
        let ticketID = rows[0].count + 1;
        let ticketCh = `ticket-${ticketID}`;
        let createdAt = message.createdAt;

        let author = message.author.id;
        let staff = message.guild.roles.find("name", "Tickets Staff");
        if (!staff){
            message.channel.send("Error!, please contact a server admin.");
            return console.log("Please create a role named Tickets Staff!");
        }
        
        var ticketlog = message.guild.channels.find("name", "ticket-log");
        if (!ticketlog) return message.channel.send("Error!, no `ticket-log` channel! Contact a server admin.");

        message.guild.createChannel(`${ticketCh}`, "text", [{
          id: author,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
        },
        {
          id: staff,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
        },
        {
          id: message.guild.defaultRole,
          deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
        }]);

        if(args[1]){
            var reason = args.join(" ");
            let ticketInfo;
            ticketInfo = `INSERT INTO tickets (ticketID, ticketAuthor, status, reason) VALUES ("${ticketCh}", "${author}", "open", "${reason}")`;
            con.query(ticketInfo);
            message.channel.send("Ticket Created!");
            var createdticketEmbed = new Discord.RichEmbed()
              .setDescription("**Ticket Created**")
              .setColor("#3def15")
              .addField("Created by:", `${message.author}`, true)
              .addField("Ticket-ID:", `${ticketCh}`, true)
              .addField("Created At:", `${createdAt}`, true)
              .addField("Reason:", `${reason}`, true)
              .setFooter(`User ID: ${author}`);
            ticketlog.send(createdticketEmbed);
        } else {
            let ticketInfo;
            ticketInfo = `INSERT INTO tickets (ticketID, ticketAuthor, status) VALUES ("${ticketCh}", "${author}", "open")`;
            con.query(ticketInfo);
            message.channel.send("Ticket Created!");
            var createdticketEmbed = new Discord.RichEmbed()
              .setDescription("**Ticket Created**")
              .setColor("#3def15")
              .addField("Created by:", `${message.author}`, true)
              .addField("Ticket-ID:", `${ticketCh}`, true)
              .addField("Created At:", `${createdAt}`, true)
              .addField("Reason:", "Not defined", true)
              .setFooter(`User ID: ${author}`);
            ticketlog.send(createdticketEmbed);
        }

    });

}

module.exports.help = {
    name: "newticket"
}