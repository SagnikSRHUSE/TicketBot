const Discord = require("discord.js");
const botconfig = require("../botconfig.json");

module.exports.run = async (bot, message, args, prefix) => {

    if(message.author.id !== "109883996019658752" && message.author.id !== "142416518888554497" && message.author.id !== "231978239063490560") return console.log(message.author.id + " tried to restart!");

    function login() {
        bot.login(botconfig.token);
        message.channel.send(":white_check_mark: Restarted!");
    }

    message.channel.send(":arrows_counterclockwise: Restarting!");
    
    if (!args[0]) return bot.destroy().then((login));

    if (args[0]){
        bot.destroy();

        let timeInS = parseInt(args[0], 10) || 0;
        if (timeInS == 0) return message.channel.send(":stop_sign: Enter a valid Integer! (in seconds)");
        let timeInMS = timeInS * 1000; 

        setTimeout(login, timeInMS);
    }

}

module.exports.help = {
    name: "restart"
}
