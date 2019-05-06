const Discord = require("discord.js");
var randomstring = require("randomstring");
const fs = require("fs");

module.exports.run = async (bot, message, args, prefix, tcMessage, staffrole, adminrole) => {

    async function createChannel(ticketCh, author, staff, tcRs, tcMessage) {
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
    let blacklisted = message.guild.roles.find("name", "Blacklisted");

    if (!blacklisted){
        console.log(`There is no role called "Blacklisted"`);
    }
    if (!staff){
        message.channel.send("Error!, please contact a server admin.");
        return console.log(`Please create a role named ${staffrole}!`);
    }
    
    var ticketlog = message.guild.channels.find("name", "ticket-log");
    if (!ticketlog) return message.channel.send("Error!, no `ticket-log` channel! Contact a server admin.");
    if (message.member.roles.find("name", "Blacklisted")) return message.channel.send("You are not allowed to make a ticket. Ask a staff member to make it for you.");

    var tcRs = args.join(" ");
    fs.appendFile(`./ticketChat-logs/${ticketCh}.txt`, `${author}\nThe above is your ID.\nReason: ${reason}\n\n`, (err) => {
      if (err) throw err;
    });
    createChannel(ticketCh, author, staff, tcRs, tcMessage);

    if(args[1]){
        var reason = args.join(" ");
        message.channel.send(reason);
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
          .addField("Reason:", "Not defined", true)
          .setFooter(`User ID: ${author}`);
        ticketlog.send(createdticketEmbed);
    }
}


module.exports.help = {
    name: "newticket"
}
