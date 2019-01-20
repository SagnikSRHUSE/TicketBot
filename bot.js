const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const mysql = require("mysql");

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

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });

});


//On Ready
bot.on("ready", async () => {
  console.log(`${bot.user.username} is online`);
  bot.user.setActivity("z!help");
});


//...................................................................................................
//.DDDDDDDDD.......AAAAA...AATTTTTTTTTT.AAAAA.....AAABBBBBBB......AAAAA.......ASSSSSS...SSSEEEEEEEE..
//.DDDDDDDDDD......AAAAA...AATTTTTTTTTT.AAAAA.....AAABBBBBBBB.....AAAAA.....AAASSSSSSS..SSSEEEEEEEE..
//.DDDDDDDDDDD....AAAAAA...AATTTTTTTTTT.AAAAAA....AAABBBBBBBBB....AAAAAA....AAASSSSSSS..SSSEEEEEEEE..
//.DDDD...DDDD....AAAAAAA......TTTT....TAAAAAA....AAAB....BBBB...BAAAAAA....AAAS..SSSSS.SSSE.........
//.DDDD....DDDD..AAAAAAAA......TTTT....TAAAAAA....AAAB....BBBB...BAAAAAA....AAAS........SSSE.........
//.DDDD....DDDD..AAAAAAAA......TTTT...TTAA.AAAA...AAABBBBBBBB...BBAA.AAAA...AAASSSSS....SSSEEEEEEE...
//.DDDD....DDDD..AAAA.AAAA.....TTTT...TTAA.AAAA...AAABBBBBBBB...BBAA.AAAA....AASSSSSSS..SSSEEEEEEE...
//.DDDD....DDDD.AAAAAAAAAA.....TTTT...TTAAAAAAAA..AAABBBBBBBBB..BBAAAAAAAA.....SSSSSSSS.SSSEEEEEEE...
//.DDDD....DDDD.AAAAAAAAAAA....TTTT..TTTAAAAAAAA..AAAB....BBBB.BBBAAAAAAAA.........SSSS.SSSE.........
//.DDDD...DDDDD.AAAAAAAAAAA....TTTT..TTTAAAAAAAA..AAAB....BBBB.BBBAAAAAAAA.AAAAS...SSSS.SSSE.........
//.DDDDDDDDDDD.DAAA....AAAA....TTTT..TTTA....AAAA.AAABBBBBBBBB.BBBA....AAAA.AAASSSSSSSS.SSSEEEEEEEE..
//.DDDDDDDDDD..DAAA.....AAAA...TTTT.TTTT.....AAAA.AAABBBBBBBBBBBBB.....AAAA.AAASSSSSSS..SSSEEEEEEEE..
//.DDDDDDDDD..DDAAA.....AAAA...TTTT.TTTT.....AAAAAAAABBBBBBB..BBBB.....AAAAA..ASSSSSS...SSSEEEEEEEE..
//...................................................................................................

var con = mysql.createConnection({
  host: "localhost",
  user: "zade_tickets",
  password: "izuir9Gezeimohciebah8eiwah6womoh",
  database: "zade_tickets"
  //user: "root",
  //password: "zendovo",
  //database: "zadebot"
});
con.connect(err => {
  if(err) throw err;
  console.log("Connected to MySQL database!");
  con.query("SHOW TABLES", console.log);
});

//----------------------------------------------X-X-X--------------------------------------------------

//On Message
bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  function prefixF(callback) {

    con.query(`SELECT value FROM settings WHERE param = 'prefix';`, function(err, prefixD) {
      con.query(`SELECT value FROM settings WHERE param = 'message';`, function(err1, tcMessageD) {
        con.query(`SELECT value FROM settings WHERE param = 'staffrole';`, function(err2, staffroleD) {
          con.query(`SELECT value FROM settings WHERE param = 'adminrole';`, function(err3, adminroleD) {
            if(err) {
              callback(err, null);
             } else {
              callback(null, prefixD[0].value, tcMessageD[0].value, staffroleD[0].value, adminroleD[0].value);
             }
           });
         });
        });
      });
    }

  prefixF(function(err, prefix, tcMessage, staffrole, adminrole){
    if(err) throw err;
 
    // For debugging - need to remove

    message.channel.send(`prefix ${prefix} \nmessage ${tcMessage} \nstaffrole ${staffrole} \nadminrole ${adminrole}`)

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length))
    if(commandfile) commandfile.run(bot, message, args, con, prefix, tcMessage, staffrole, adminrole);

  });

  //Folder check
  if (!fs.existsSync("./ticketChat-logs")){
    fs.mkdirSync("./ticketChat-logs");
  }

  con.query(`SELECT * FROM tickets WHERE ticketID = '${message.channel.name}'`, (err, rows) => {

    if(rows.length < 1){
      return;
    } else {
      let content = message.content;
      let author = message.author.id;
      let createdAt = message.createdAt;

      let msg = `[${createdAt}]` + ` ${author}: ` + content + `\n`;

      let ticketID = rows[0].ticketID;
      fs.appendFile(`./ticketChat-logs/${ticketID}.txt`, msg, (err) => {
        if (err) throw err;
      });
    }

  });

});

//Login
bot.login(botconfig.token);
