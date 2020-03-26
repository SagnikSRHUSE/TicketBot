const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

//Commands Handler
fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach(file =>{
    let props = require(`./commands/${file}`);
    console.log(`${file} loaded!`);
    bot.commands.set(props.help.name, props);
  });

});

//On Ready
bot.on("ready", async () => {
  console.log(`${bot.user.username} is online`);
  bot.user.setActivity(`${botconfig.prefix}help`);
});

//Folder check
if (!fs.existsSync("./ticketChat-logs")){
  fs.mkdirSync("./ticketChat-logs");
}

//On Message
bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
 
  let prefix = botconfig.prefix;
  let staffrole = "Support";
  let adminrole = "Development";

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length))
  if (commandfile) commandfile.run(bot, message, args, prefix, staffrole, adminrole);

  // Log messages to the database
  // TODO

});

//Login
bot.login(botconfig.token);
