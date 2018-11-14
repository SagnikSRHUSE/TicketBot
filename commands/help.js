const Discord = require("discord.js");

module.exports.run = async (bot, message, args, con, prefix) => {

    if(!args[0]){

        let help = new Discord.RichEmbed()
        .setDescription(`**Help Menu**\nDo ${prefix}help [type]`)
        .addField("Tickets:", "Info for tickets.")
        .setFooter("<> = Required | [] = optional")
        .setColor("#2aedcf");
        message.channel.send(help);

    } else if(args[0] === "tickets" || args[0] === "ticket"){

        let ticketHelp = new Discord.RichEmbed()
        .setDescription(`**Tickets**\nList of all Commands`)
        .addField(`${prefix}newticket [reason]`, "Create a ticket. You can optionally provide a reason.")
        .addField(`${prefix}ticketfor <@user> [reason]`, "Staff Only! Creates a ticket for the mentioned user.")
        .addField(`${prefix}closeticket [reason]`, "Staff Only! Closes the ticket. Use it in the ticket channel itself.")
        .addField(`${prefix}ticketinfo <ticket-ID or ID>`, "Staff Only! Shows information about a ticket.")
        .setFooter("<> = Required | [] = optional")
        .setColor("#2aedcf");
        message.channel.send(ticketHelp);

    } else {
        message.channel.send("Not a valid type. Do `" + prefix + "help` to see the valid types.");
    }

}

module.exports.help = {
    name: "help"
}