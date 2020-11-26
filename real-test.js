const Discord = require('discord-module');
const config = require('./config.json');

const discord = new Discord(config);

discord.onmessage = (message, reply) => {
  console.log(message.content); 
  console.log(message);

  if (message.author.username !== "TestVortexBot") {
    reply(message.content);
  };
};
