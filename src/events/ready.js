const { Events, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const fs = require('fs');
const Config = require('../config.js');
const LootSessionViews = require('../views/lootSessionViews.js');
require('dotenv').config();


function execute(clientInfo, DiscordClient) {
    console.log(`${this.name}: ${clientInfo.user.tag} is ready to go!`);

    DiscordClient.user.setActivity('SPIRIT OF AZUREGOS HAS SPAWNED!!!');

    // Register Commands
    const commandFolders = fs.readdirSync("./src/commands");
    DiscordClient.handleCommands(commandFolders, "./src/commands");

    if (process.env.SEND_INITIAL_MESSAGES === 'true') {
        DiscordClient.channels.fetch(Config.ServerInfo.channels.loot.id)
            .then(channel => {
                channel.send({
                    embeds: [LootSessionViews.GetStarted.embed],
                    components: [LootSessionViews.GetStarted.buttonRow],
                    fetchReply: false
                });
            })
            .catch(console.error);
    }
}

module.exports = {
    name: Events.ClientReady,
    execute: execute
}