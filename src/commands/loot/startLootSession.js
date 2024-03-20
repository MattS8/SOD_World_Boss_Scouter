const HashMap = require('hashmap');
const Config = require('../../config.js')
const CommandType = Config.Enums.CommandType
const ButtonName = Config.Enums.ButtonName
const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');

// -- Embed Messages -- //
const lootEmbed = new EmbedBuilder()
    .setColor(0xA2810D)
    .setTitle('Select Boss')
    .setDescription('Which boss is this loot is from?')
    .setTimestamp();

const errMultSessionEmbed = new EmbedBuilder()
    .setColor(0xC12115)
    .setTitle('Loot Session Already Running')
    .setDescription('You already have a loot session started. Please try closing out that session before starting a new one.')
    .setTimestamp();

// -- Button Rows -- //
const bossSelectRow = new ActionRowBuilder()
    .addComponents(
        // Start
        new ButtonBuilder()
            .setCustomId(ButtonName.SelectLootBoss_Azuregos)
            .setLabel(Config.Bosses.Azuregos.name)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(ButtonName.SelectLootBoss_Kazzak)
            .setLabel(Config.Bosses.Kazzak.name)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(ButtonName.SelectLootBoss_GreenDragons)
            .setLabel('Green Dragon')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(ButtonName.EndLootSession)
            .setLabel('Close')
            .setStyle(ButtonStyle.Danger)
    );

// -- Exports -- //
function interact(interaction, DiscordClient) {
    // Init LootSessions list
    if (!DiscordClient.LootSessions) {
        DiscordClient.LootSessions = new HashMap();
        console.log("Initializing LootSessions Map...");
    }

    // Ensure the user doesn't have another loot session going on
    if (DiscordClient.LootSessions.has(interaction.user.id)) {
        interaction.reply({
            embeds: [errMultSessionEmbed],
            ephemeral: true
        }).then((message) => DiscordClient.handleTimedMessage(message.id, message, 10 * 1000))
            .catch(console.error)
    } else {
        interaction.reply({
            embeds: [lootEmbed],
            components: [bossSelectRow],
            ephemeral: true,
            fetchReply: false
        }).then((message) => {
            DiscordClient.LootSessions.set(interaction.user.id, {
                userId: interaction.user.id,
                message: message,
                guilds: new HashMap()
            })
            DiscordClient.handleTimedMessage(message.id, message, 30 * 60 * 1000, () => { DiscordClient.LootInteractions.remove(interaction.user.id) })
        })
            .catch(console.error)
    }
}

module.exports = {
    btnName: ButtonName.StartLootSession,
    interact: interact,
    commandType: CommandType.ButtonCommand
}