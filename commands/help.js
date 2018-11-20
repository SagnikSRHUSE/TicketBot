const Discord = require("discord.js");

module.exports.run = async (bot, message, args, con, prefix) => {

    if(!args[0]){

        let help = new Discord.RichEmbed()
        .setDescription(`**Help Menu**\nDo ${prefix}help [type]`)
        .addField("Tickets:", "Info for tickets.")
        .addField("Settings:", "Info about settings.")
        .setFooter("<> = Required | [] = optional")
        .setColor("#3def15");
        message.channel.send(help);

    } else if(args[0] === "tickets" || args[0] === "ticket"){

        let ticketHelp = new Discord.RichEmbed()
        .setDescription(`**Tickets**\nList of all Commands`)
        .addField(`${prefix}newticket [reason]`, "Create a ticket. You can optionally provide a reason.")
        .addField(`${prefix}ticketfor <@user> [reason]`, "Staff Only! Creates a ticket for the mentioned user.")
        .addField(`${prefix}closeticket [reason]`, "Staff Only! Closes the ticket. Use it in the ticket channel itself.")
        .addField(`${prefix}ticketinfo <ticket-ID or ID>`, "Staff Only! Shows information about a ticket.")
        .setFooter("<> = Required | [] = optional")
        .setColor("#3def15");
        message.channel.send(ticketHelp);

    } else if(args[0] === "settings" || args[0] === "setting"){

        let settingHelp = new Discord.RichEmbed()
        .setDescription(`**Settings**\nList of all Commands\n**ADMIN ONLY**h `)
        .addField(`${prefix}settings list`, "Lists all settings which you can change.")
        .addField(`${prefix}settings info <type>`, "Sends the value of the setting.")
        .addField(`${prefix}settings set <type>`, "Sets a new value for the setting.")
        .setFooter("<> = Required | [] = optional")
        .setColor("#3def15");
        message.channel.send(settingHelp);

    } else {
        message.channel.send("Not a valid type. Do `" + prefix + "help` to see the valid types.");
    }

}

module.exports.help = {
    name: "help"
}