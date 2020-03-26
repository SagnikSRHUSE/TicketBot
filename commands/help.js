const Discord = require("discord.js");
var randomstring = require("randomstring");

module.exports.run = async (bot, message, args, prefix) => {

    if(!args[0]){

        let help = new Discord.MessageEmbed()
        .setDescription(`**Help Menu**\nDo ${prefix}help [type]`)
        .addField("Tickets:", "Info for tickets.")
        .setFooter("<> = Required | [] = optional")
        .setColor("#3def15");
        message.channel.send(help);

    } else if(args[0].toLowerCase() === "tickets" || args[0].toLowerCase() === "ticket"){

        let ticketHelp = new Discord.MessageEmbed()
        .setDescription(`**Tickets**\nList of all Commands`)
        .addField(`${prefix}newticket [reason]`, "Create a ticket. You can optionally provide a reason.")
        .addField(`${prefix}ticketfor <@user> [reason]`, "Staff Only! Creates a ticket for the mentioned user.")
        .addField(`${prefix}closeticket [reason]`, "Staff Only! Closes the ticket. Use it in the ticket channel itself.")
        .setFooter("<> = Required | [] = optional")
        .setColor("#3def15");
        message.channel.send(ticketHelp);

    } else {
        let embed = new Discord.MessageEmbed()
        .setDescription(":stop_sign: Topic not found!")
        .setFooter("Ambyre Nodes - my.ambyrenodes.net");

        let v = randomstring.generate({
            length: 1,
            charset: '12'
        });
        if(v == 1){
            embed.addField("https://bit.ly/1QgQ0gI", "This may be useful!");
            message.channel.send(embed);
        } else {
            embed.addField("https://bit.ly/2YhCgdV", "This may be useful!");
            message.channel.send(embed);
        }
    }

}

module.exports.help = {
    name: "help"
}
