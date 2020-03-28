const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const pgp = require('pg-promise')();
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

// Connect to DB
const client = pgp({
  host: 'localhost',
  port: 54320,
  database: 'tickets',
  user: 'postgres',
  password: '12345',
})

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
  if (commandfile) commandfile.run(bot, message, args, prefix, staffrole, adminrole, client);

  // Log messages to the database
  let chName = message.channel.name
  if (chName.startsWith('ticket_')) {
    logMessage(message, client);
  }

});

function logMessage(message, client) {

  let ticketName = message.channel.name;

  let query = 'INSERT INTO $1~ (content, author, time) VALUES ($2, $3, $4)'
  let values = [ticketName, message.content, message.author.id, message.createdAt]
  
  client.none(query, values)
    .catch(e => console.error(e.stack));
  
}

//Login
bot.login(botconfig.token);
