const Discord = require('discord.js');
const fs = require('fs');
const {prefix, token, game} = require('./configuration.json');
const client = new Discord.Client();
var channels = new Discord.Collection();

// Notifies that bot is live
client.on('ready', () => {
    client.user.setPresence({ game: { name: game }, status: 'Online' })
    .then(console.log('Presence Set.'))
    .catch(console.error);
    console.log('Ready!');
});

// Handles all errors....for now
client.on('error', console.error);

// Fires when any message is sent in a channel bot is in
client.on('message', message => {
   if(!message.content.startsWith(prefix) || message.author.bot){
        return 
    };
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    handleCommand(message, commandName, args) 
});

// Handles all messages (auto responses & commands)
function handleCommand(message, commandName, args){
    if(commandName === "spam"){
        if(args.length <= 0){
            message.channel.send("giv message to spam")
            return
        }
        spam(message, message.channel, args);
    } 
    else if(commandName === "stop"){
        stop(message.channel);
    }
}

function spam(message, channel, text){
    if(channels.has(channel)){
       message.reply("Timer already started on this channel");
    }
    else{
        channel.send("STARTING SPAM")
        channels.set(channel, text)  
    }
}

function stop(channel){
    if(channels.has(channel)){
        channel.send("Stopping spam");
        channels.delete(channel);
    }
    else{
        channel.send("Not spamming this channel");
    }
}

client.login(token);
setInterval(()=>{
    console.log("spam")
    keys = channels.keyArray();
    for(var x = 0; x<keys.length;x++){
        command = channels.get(keys[x]);
        keys[x].send(command.join(" ")); 
    }
}, 2000)
