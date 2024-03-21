const { EmbedBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder,  ModalBuilder, ButtonBuilder, messageLink, TextInputBuilder, Message, TextInputStyle } = require('discord.js');
const Config = require('../config.js');
const { StringSelectMenuOptionBuilder } = require('@discordjs/builders');
const ButtonName = Config.Enums.ButtonName;
const Guilds = Config.Guilds;

module.exports = {
    GetStarted: {
        embed: new EmbedBuilder()
            .setColor(0xA2810D)
            .setTitle('Start a Loot Session')
            .setDescription('Click the button below to create a new loot session and determine roll ranges for each guild based on participation.')
            .setTimestamp(),
        buttonRow: new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(Config.Enums.ButtonName.StartLootSession)
                    .setLabel('Start')
                    .setStyle(ButtonStyle.Primary)
            )
    },
    GreenDragonSelection: {
        embed: new EmbedBuilder()
            .setColor(0xA2810D)
            .setTitle('Select Green Dragon')
            .setDescription('Which green dragon is this loot from?')
            .setTimestamp(),
        buttonRow: new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(ButtonName.SelectLootBoss_Emriss)
                    .setLabel(Config.Bosses.Emriss.name)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(ButtonName.SelectLootBoss_Lethon)
                    .setLabel(Config.Bosses.Lethon.name)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(ButtonName.SelectLootBoss_Taerar)
                    .setLabel(Config.Bosses.Taerar.name)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(ButtonName.SelectLootBoss_Ysondre)
                    .setLabel(Config.Bosses.Ysondre.name)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(ButtonName.EndLootSession)
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger)
            )
    },
    BossSelection: {
        embed: new EmbedBuilder()
            .setColor(0xA2810D)
            .setTitle('Select Boss')
            .setDescription('Which boss is this loot from?')
            .setTimestamp(),
        buttonRow: new ActionRowBuilder()
            .addComponents(
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
            )
    },
    MainView: {
        embed: (session) => {
            let mainViewEmbed = new EmbedBuilder()
                .setColor(0xA2810D)
                .setTitle(`Loot for ${session.boss}:`)
                .setDescription(`**Roll:** \`/roll ${session.roll}\``)
                .setTimestamp();
            for (guild of session.attendance.keys()) {
                let sessionInfo = session.attendance.get(guild)
                mainViewEmbed.addFields({ name: `${guild} - ${sessionInfo.players} players`, value: `${sessionInfo.rollMin} - ${sessionInfo.rollMax}` })
            }

            return mainViewEmbed
        },
        buttonRow: new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(ButtonName.LootGuildSelection)
                    .setLabel('Add Guild Attendance')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(ButtonName.EndLootSession)
                    .setLabel('Close')
                    .setStyle(ButtonStyle.Danger)
            )
    },
    GuildSelection: {
        embed: new EmbedBuilder()
            .setColor(0xA2810D)
            .setTitle('Select a Guild')
            .setDescription(`Note: If a guild is missing from selection, please dm ${Config.GeneralInfo.botOwner}.`)
            .setTimestamp(),
        buttonRow: () => {
            const options = []
            for (guild of Config.Guilds) {
                options.push(new StringSelectMenuOptionBuilder()
                    .setLabel(guild.name)
                    .setValue(guild.tag))
            }
            return new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(ButtonName.LootGuildSelectionSelected)
                        .setPlaceholder('Choose a guild!')
                        .addOptions(options)
                );
        }
    },
    GuildAttendance: {
        modal: (guild) => {
            return new ModalBuilder()
                .setCustomId(ButtonName.LootGuildAttendance)
                .setTitle(`<${guild.name}> Members Present`)
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setLabel("Number of Players")
                            .setStyle(TextInputStyle.Short)
                            .setCustomId(ButtonName.TxtGuildAttendance)
                    )
                )
        } 
    },
    ErrorMultipleSessions: {
        embed: new EmbedBuilder()
            .setColor(0xC12115)
            .setTitle('Loot Session Already Running')
            .setDescription('You already have a loot session started. Please try closing out that session before starting a new one.')
            .setTimestamp()
    }
}