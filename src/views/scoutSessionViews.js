const { EmbedBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, ButtonBuilder, messageLink, TextInputBuilder, Message, TextInputStyle } = require('discord.js');
const Config = require('../config.js');

module.exports = {
    MainView: {
        getEmbed: (boss, scoutSession) => {
            let descriptionText = scoutSession.currentScouts.keys().length > 0 ? `The following players are currently scouting:` : `:exclamation: *No players are currently scouting* :exclamation:`;
            let mainViewEmbed = new EmbedBuilder()
                .setColor(boss.color)
                .setTitle(`${boss.name} Scouting:`)
                .setDescription(descriptionText);
            for (key of scoutSession.currentScouts.keys()) {
                let scout = scoutSession.currentScouts.get(key);
                // console.log(`${JSON.stringify(scout)}`)
                console.log(`Adding ${scout.user.displayName} at time ${scout.startTime}`)
                mainViewEmbed.addFields({ name: `<${scout.guildName}> ${scout.user.displayName}`, value: `Started at: <t:${scout.startTime}:t>`, inline: true })
            }

            return mainViewEmbed
        },
        getButtonRow: (boss) => {
            return new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(boss.btnNames.scouting)
                        .setLabel(`Begin Scouting`)
                        .setEmoji('\➡️')
                        .setStyle(ButtonStyle.Primary)
                )
        }
    },
    ScoutingOptions: {
        getEmbed: (boss) => new EmbedBuilder()
            .setColor(boss.color)
            .setTitle(`${boss.name}: Scouting Options`),
        getButtonRow: (boss) => new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(boss.btnNames.bossSpotted)
                    .setLabel(`Boss Spotted!`)
                    .setEmoji('\❗')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(boss.btnNames.stopScouting)
                    .setLabel(`Stop Scouting`)
                    .setEmoji('\🛑')
                    .setStyle(ButtonStyle.Secondary)
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
                    .setLabel(`Stop Scouting`)
                    .setEmoji('\🛑')
                    .setStyle(ButtonStyle.Secondary)
            )
    }
}