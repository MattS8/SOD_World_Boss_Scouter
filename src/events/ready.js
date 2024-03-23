const { Events, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const fs = require('fs');
const Config = require('../config.js');
const LootSessionViews = require('../views/lootSessionViews.js');
const ScoutSessionViews = require('../views/scoutSessionViews.js');
const { channel } = require('diagnostics_channel');
require('dotenv').config();


function execute(clientInfo, DiscordClient) {
    console.log(`${this.name}: ${clientInfo.user.tag} is ready to go!`);

    DiscordClient.user.setActivity('SPIRIT OF AZUREGOS HAS SPAWNED!!!');

    // Register Commands
    const commandFolders = fs.readdirSync("./src/commands");
    DiscordClient.handleCommands(commandFolders, "./src/commands");

    if (process.env.SEND_INITIAL_MESSAGES === 'true') {
        DiscordClient.channels.fetch(Config.Server.channels.loot.id)
            .then(channel => {
                channel.send({
                    embeds: [LootSessionViews.GetStarted.embed],
                    components: [LootSessionViews.GetStarted.buttonRow],
                    fetchReply: false
                });
            })
            .catch(console.error);

        Object.values(Config.Bosses).forEach((boss) => {
            DiscordClient.channels.fetch(boss.channels.scouting)
            .then(channel => {
                channel.send({
                    embeds: [ScoutSessionViews.MainView.getEmbed(boss, DiscordClient.getScoutSessions(DiscordClient).get(boss.name))],
                    components: [ScoutSessionViews.MainView.getButtonRow(boss)],
                    fetchReply: false
                });
            })
            .catch(console.error);
        })
    }
}

module.exports = {
    name: Events.ClientReady,
    execute: execute
}