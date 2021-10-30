const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args, prefix) => {

    if(!botconfig.superusers.includes(message.author.id)) return console.log(message.author.id + " tried to shutdown!");

    message.channel.send(":stop_button: Shutting Down!").then(bot.destroy());

}

module.exports.help = {
    name: "shutdown"
}
