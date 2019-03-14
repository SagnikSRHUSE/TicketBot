const Discord = require("discord.js");

module.exports.run = async (bot, message, args, con, prefix, tcMessage, staffrole, adminrole) => {


    if (!message.member.roles.find("name", adminrole) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Sorry, you can't use these commands.");

    if(args[0] === "list") {
        let listEmbed = new Discord.RichEmbed()
        .setDescription("**Settings:**")
        .addField("Prefix", "Set the prefix for the bot.")
        .addField("Message", "Set the message to be sent in the created ticket channel.")
        .addField("Staff Role", "Set the staff role for tickets.")
        .addField("Admin Role", "Set the admin role.")
        .setColor("#43b749");
        message.channel.send(listEmbed);
    } else if(args[0] === "set") {

        if(args[1] === "prefix") {
            
            if(!args[2]) return message.channel.send("Missing prefix!");

            con.query(`UPDATE settings SET value = '${args[2]}' WHERE param = 'prefix';`);
            message.channel.send("Set prefix to `" + prefix + "`");

        } else if(args[1] === "message") {

            if(!args[2]) return message.channel.send("Missing message!");

            let msgArray = args.slice(2);
            let msg = msgArray.join(" ");

            con.query(`UPDATE settings SET value = '${msg}' WHERE param = 'message';`);
            message.channel.send("Set message to `" + msg + "`");

        } else if(args[1] === "staffrole" || args[1] === "staff role") {

            if(!args[2]) return message.channel.send("Missing staff role name!");

            let roleArray = args.slice(2);
            let role = roleArray.join(" ");
            
            con.query(`UPDATE settings SET value = '${role}' WHERE param = 'staffRole';`);
            message.channel.send("Set staff role to `" + role + "`");

        } else if(args[1] === "adminrole" || args[1] === "admin role") {

            if(!args[2]) return message.channel.send("Missing admin role name!");

            let roleArray = args.slice(2);
            let role = roleArray.join(" ");
            
            con.query(`UPDATE settings SET value = '${role}' WHERE param = 'adminRole';`);
            message.channel.send("Set admin role to `" + role + "`");

        } else {

            message.channel.send("Not a valid setting.");

        }
    } else if(args[0] === "info"){

        if(args[1] === "prefix") {

            con.query(`SELECT value FROM settings WHERE param = 'prefix'`, (err, rows) => {
                if(err) throw err;

                let info = new Discord.RichEmbed()
                .setDescription("**Settings Info**")
                .setColor("#3def15")
                .addField("Prefix:", rows[0].value, true);

                message.channel.send(info);
            });

        } else if(args[1] === "message") {

            con.query(`SELECT value FROM settings WHERE param = 'message'`, (err, rows) => {
                if(err) throw err;

                let info = new Discord.RichEmbed()
                .setDescription("**Settings Info**")
                .setColor("#3def15")
                .addField("Message:", rows[0].value, true);
                
                message.channel.send(info);
            });

        } else if(args[1] === "staffrole") {

            con.query(`SELECT value FROM settings WHERE param = 'staffrole'`, (err, rows) => {
                if(err) throw err;

                let info = new Discord.RichEmbed()
                .setDescription("**Settings Info**")
                .setColor("#3def15")
                .addField("Staff Role:", rows[0].value, true);
                
                message.channel.send(info);
            });

        } else if(args[1] === "adminrole") {

            con.query(`SELECT value FROM settings WHERE param = 'adminrole'`, (err, rows) => {
                if(err) throw err;

                let info = new Discord.RichEmbed()
                .setDescription("**Settings Info**")
                .setColor("#3def15")
                .addField("Admin Role:", rows[0].value, true);
                
                message.channel.send(info);
            });

        } else {

            message.channel.send("Not a valid setting.");

        }

    } else {
        
        let settingHelp = new Discord.RichEmbed()
        .setDescription(`**Settings**\nList of all Commands\n**ADMIN ONLY**h `)
        .addField(`${prefix}settings list`, "Lists all settings which you can change.")
        .addField(`${prefix}settings info <type>`, "Sends the value of the setting.")
        .addField(`${prefix}settings set <type>`, "Sets a new value for the setting.")
        .setFooter("<> = Required | [] = optional")
        .setColor("#2aedcf");
        message.channel.send(settingHelp);
    }
}

module.exports.help = {
    name: "settings"
}