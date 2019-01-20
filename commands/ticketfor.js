const Discord = require("discord.js");

module.exports.run = async (bot, message, args, con, prefix, tcMessage, staffrole) => {

    async function createChannel(ticketCh, author, staff, mention, tcRs, tcMessage) {
        let ch = await message.guild.createChannel(`${ticketCh}`, "text", [{
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
          },
          {
            id: mention,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
      }]);
      ch = await ch.send(`${tcMessage}\n**Reason:** ${tcRs}`);
        
    }

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
        let staff = message.guild.roles.find("name", staffrole);
        if (!staff){
            message.channel.send("Error!, please contact a server admin.");
            return console.log(`Please create a role named ${staffrole}!`);
        }
        
        var ticketlog = message.guild.channels.find("name", "ticket-log");
        if (!ticketlog) return message.channel.send("Error!, no `ticket-log` channel! Contact a server admin.");

        //For another user
        if (!message.member.roles.find("name", staffrole)) return message.channel.send("Sorry, you can't create a ticket for someone else.");
            
        if(!message.mentions.users.first()) return message.channel.send("Please mention a user.");
        var mention = message.mentions.users.first().id;

        var str = args.join(" ");
        var tcRs = str.substr(22);
        createChannel(ticketCh, author, staff, mention, tcRs, tcMessage);

        if(args[1]){
            var str = args.join(" ");
            var reason = str.substr(22);
            let ticketInfo;
            ticketInfo = `INSERT INTO tickets (ticketID, ticketAuthor, ticketFor, status, reason) VALUES ("${ticketCh}", "${author}", "${mention}", "open", "${reason}")`;
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
            ticketInfo = `INSERT INTO tickets (ticketID, ticketAuthor, ticketFor, status) VALUES ("${ticketCh}", "${author}", "${mention}", "open")`;
            con.query(ticketInfo);
            message.channel.send("Ticket Created!");
            var createdticketEmbed = new Discord.RichEmbed()
              .setDescription("**Ticket Created**")
              .setColor("#3def15")
              .addField("Created by:", `${message.author}`, true)
              .addField("Ticket-ID:", `${ticketCh}`, true)
              .addField("Created At:", `${createdAt}`, true)
              .addField("Reason:", "Not Defined", true)
              .setFooter(`User ID: ${author}`);
            ticketlog.send(createdticketEmbed);
        }


    });

}

module.exports.help = {
    name: "ticketfor"
}