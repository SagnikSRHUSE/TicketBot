const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix) => {

    if(!message.author.id == "109883996019658752" || !message.author.id == "142416518888554497" || !message.author.id == "231978239063490561") return;

    bot.destroy();

}

module.exports.help = {
    name: "shutdown"
}
