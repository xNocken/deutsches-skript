const Discord = require('discord-module');
const config = require('./config.json');

const discord = new Discord(config);

discord.onmessage = (message, reply) => { console.log(message); reply(message.content + summe von "was tolles" und " oder nicht") }