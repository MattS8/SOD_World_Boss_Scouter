const { Events, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const fs = require('fs');
const Config = require('../config.js');
require('dotenv').config();


function execute(clientInfo, DiscordClient) {
    console.log(`${this.name}: ${clientInfo.user.tag} is ready to go!`);

    DiscordClient.user.setActivity('SPIRIT OF AZUREGOS HAS SPAWNED!!!');

    // Register Commands
    const commandFolders = fs.readdirSync("./src/commands");
    DiscordClient.handleCommands(commandFolders, "./src/commands");

    if (process.env.SEND_INITIAL_MESSAGES === 'true') {
        // Show loot session prompt message
        const lootEmbed = new EmbedBuilder()
            .setColor(0xA2810D)
            .setTitle('Start a Loot Session')
            .setDescription('Click the button below to create a new loot session and determine roll ranges for each guild based on participation.')
            .setTimestamp();
        const lootRow = new ActionRowBuilder()
            .addComponents(
                // Start
                new ButtonBuilder()
                    .setCustomId(Config.Enums.ButtonName.StartLootSession)
                    .setLabel('Start')
                    .setStyle(ButtonStyle.Primary)
            );
        DiscordClient.channels.fetch(Config.ServerInfo.channels.loot.id)
            .then(channel => {
                channel.send({
                    embeds: [lootEmbed],
                    components: [lootRow],
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