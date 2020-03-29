const Discord = require("discord.js");
const botconfig = require("./botconfig.json");

async function createChannel(message, chName, staffRoleId, initialMsgs, logEmbed, client, reason, mentionedId) {

    let perms = [
        {
            id: message.author.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        },
        {
            id: staffRoleId,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        },
        {
            id: message.guild.roles.everyone,
            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        }
    ]

    if (mentionedId !== undefined) perms.push({
        id: mentionedId,
        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    })

    message.guild.channels.create(chName, {
        type: 'text',
        permissionOverwrites:  perms
    })
        .then(channel => {

            // Move the channel to the tickets category
            let ticketCat = message.guild.channels.cache.find(ch => ch.name.toLowerCase() === 'tickets');
            if (ticketCat !== undefined) {
                channel.setParent(ticketCat, { lockPermissions: false })
                    .catch(console.error);
            } else {
                console.log('No category name Tickets found!');
            }

            
            // Send the messages
            if (initialMsgs === undefined) return;
            initialMsgs.forEach(msg => {

                channel.send(msg);
                
            });


            // Log into the ticket-log channel
            let ticketlogCh = message.guild.channels.cache.find(ch => ch.name === 'ticket-log');
            ticketlogCh.send(logEmbed);

            if (botconfig.logMessage === false) return;

            // Create a new table for the ticket messages to be stored
            let query = `CREATE TABLE $1~(
                id BIGSERIAL NOT NULL PRIMARY KEY,
                content TEXT NOT NULL,
                author BIGINT NOT NULL,
                message_id BIGINT NOT NULL,
                edited BOOLEAN NOT NULL,
                time TIMESTAMP NOT NULL,
                old_message TEXT
            )`
            let values = [chName]

            client.none(query, values)
                .catch(e => console.error(e.stack));

        })
        .catch(console.error);
    
}

function initialChecks(message, staffrole) {

    // Get the role id & Perform check for the staff role
    let staffId = message.guild.roles.cache.find(role => role.name === staffrole);
    if (staffId === undefined){
        message.channel.send("Error!, please contact a server admin.");
        return console.log(`Please create a role named ${staffrole}!`);
    }

    // Get the blacklisted role & perform a check for it's existance
    let blacklistedRId = message.guild.roles.cache.find(role => role.name === 'Blacklisted');
    if (blacklistedRId === undefined) {
        console.log(`There is no role called "Blacklisted"`);
    }

    // Check if the author is blacklisted
    let blacklistedMember = message.member.roles.cache.find(role => role.id === blacklistedRId)
    if (blacklistedMember !== undefined) return message.channel.send("You are not allowed to make a ticket. Ask a staff member to make it for you.");

    // Get the ticket-log channel
    let ticketlogCh = message.guild.channels.cache.find(ch => ch.name === 'ticket-log');
    if (ticketlogCh === undefined) return message.channel.send("Error!, no `ticket-log` channel! Contact a server admin.");

    return 2;
}

module.exports = {
    createChannel: createChannel,
    initialChecks: initialChecks
}