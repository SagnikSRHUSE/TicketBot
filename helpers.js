const Discord = require("discord.js");

async function createChannel(message, chName, staffRoleId, initialMsgs, logEmbed, mentionedId) {

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
            
            // Send the messages
            if (initialMsgs === undefined) return;
            initialMsgs.forEach(msg => {

                channel.send(msg);
                
            });

            // Insert info into the database
            // TODO
            console.log('TODO log into database!')

            // Log into the ticket-log channel
            let ticketlogCh = message.guild.channels.cache.find(ch => ch.name === 'ticket-log');
            ticketlogCh.send(logEmbed);                

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