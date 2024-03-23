const { EmbedBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, ButtonBuilder, messageLink, TextInputBuilder, Message, TextInputStyle } = require('discord.js');
const Config = require('../config.js');
const Bosses = Config.Bosses;
const ScoutFunctions = require(`../functions/scoutFunctions.js`);
const Utils = require(`../util.js`);

module.exports = {
    MainView: {
        getEmbed: (boss, scoutSession) => {
            let mainViewEmbed = new EmbedBuilder()
                .setColor(boss.color)
                .setTitle(`${boss.name} Scouting:`)
                .setDescription(`The following players are currently scouting:`)
                .setTimestamp();
            for (scout of scoutSession.currentScouts.keys()) {
                let scout = scoutSession[scout];
                mainViewEmbed.addFields({ name: `<${scout.guild.tag}> ${scout.user.displayName}`, value: `Started at: <t:${scout.startTime}:t>`, inline: true })
            }

            return mainViewEmbed
        },
        getButtonRow: (boss) => {
            return new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(boss.btnNames.scouting)
                        .setLabel(`Begin Scouting ${boss.name}`)
                        .setStyle(ButtonStyle.Primary)
                )
        }
    },
    ScoutingOptions: {
        getEmbed: (boss) => new EmbedBuilder()
            .setColor(boss.color)
            .setTitle('Scouting Options')
            .setDescription(`The buttons below are for scouting ${boss.name} only!`)
            .setTimestamp(),
            getButtonRow: (boss) => new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(boss.btnNames.bossSpotted)
                    .setLabel(`Boss Spotted!`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(boss.btnNames.stopScouting)
                    .setLabel(`Stop Scouting ${boss.name}`)
                    .setStyle(ButtonStyle.Danger)
            )
    },
    ErrorAlreadyScouting: {
        getEmbed: (boss, scout) => new EmbedBuilder()
            .setColor(Config.General.errorColor)
            .setTitle(`Already Scouting ${boss.name}`)
            .setDescription(`You are already signed up for scouting ${boss.name} (Since <t:${scout.startTime}:t>)\nIf you think this is in error, end your shift and start a new one.`)
            .setTimestamp(),

        getButtonRow: (boss) => new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(boss.btnNames.stopScouting)
                .setLabel(`Stop Scouting ${boss.name}`)
                .setStyle(ButtonStyle.Danger)
        )
    }
}