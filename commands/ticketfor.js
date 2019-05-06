const Discord = require("discord.js");
var randomstring = require("randomstring");
const fs = require("fs");

module.exports.run = async (bot, message, args, prefix, tcMessage, staffrole, adminrole) => {

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
      ch = await ch.send(`${tcMessage}\n**Reason:** ${tcRs}\n${staff}`);
        
    }

    //Creation of Ticket
    let ticketID = randomstring.generate({
      length: 5,
      capitalization: "lowercase"
    });
    let ticketCh = `ticket-${ticketID}`;

    while (message.guild.channels.find("name", ticketCh)) {
        ticketID = randomstring.generate({
          length: 5,
          capitalization: "lowercase"
        });
        ticketCh = `ticket-${ticketID}`;
    }
    
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
    fs.appendFile(`./ticketChat-logs/${ticketCh}.txt`, `${mention}\nThe above is your ID.\nReason: ${reason}\n\n`, (err) => {
      if (err) throw err;
    });

    var str = args.join(" ");
    var tcRs = str.substr(22);
    createChannel(ticketCh, author, staff, mention, tcRs, tcMessage);

    if(args[1]){
        var str = args.join(" ");
        var reason = str.substr(22);
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

}

module.exports.help = {
    name: "ticketfor"
}
