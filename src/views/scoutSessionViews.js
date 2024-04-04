const {
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ModalBuilder,
  ButtonBuilder,
  messageLink,
  TextInputBuilder,
  Message,
  TextInputStyle
} = require('discord.js')
const InputName = require('../constants.js').Enums.InputName
const Config = require('../config.js')

module.exports = {
  MainView: {
    getEmbed: (boss, scoutSession) => {
      let descriptionText =
        scoutSession.currentScouts.keys().length > 0
          ? `The following players are currently scouting:`
          : `:exclamation: *No players are currently scouting* :exclamation:`
      let mainViewEmbed = new EmbedBuilder()
        .setColor(boss.color)
        .setTitle(`${boss.name} Scouting:`)
        .setDescription(descriptionText + '\u200B')
      for (key of scoutSession.currentScouts.keys()) {
        let scout = scoutSession.currentScouts.get(key)
        mainViewEmbed.addFields({
          name: `${scout.member.displayName}`,
          value: `Started at: <t:${scout.startTime}:t>`,
          inline: true
        })
      }

      return mainViewEmbed
    },
    getButtonRow: boss => {
      return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(boss.btnNames.scouting)
          .setLabel(`Begin Scouting`)
          .setEmoji('➡️')
          .setStyle(ButtonStyle.Primary)
      )
    }
  },
  ScoutingOptions: {
    getEmbed: boss =>
      new EmbedBuilder().setColor(boss.color).setTitle(`Scouting Options:`),
    getButtonRow: boss =>
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(boss.btnNames.bossSpotted)
          .setLabel(`Boss Spotted!`)
          .setEmoji('❗')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(boss.btnNames.stopScouting)
          .setLabel(`Stop Scouting`)
          .setEmoji('🛑')
          .setStyle(ButtonStyle.Secondary)
      )
  },
  BossSpotted: {
    getEmbed: (scoutArea, partyLeader) =>
      new EmbedBuilder()
        .setColor(scoutArea.color)
        .setTitle(
          `\❗\❗${
            scoutArea.type === 'Green Dragon'
              ? 'GREEN DRAGONS HAVE SPAWNED'
              : `${scoutArea.name.toUpperCase()} HAS SPAWNED`
          }\❗\❗`
        )
        .setDescription(
          `**Invite Whisper:**\n > ${partyLeader}\n${
            scoutArea.type != 'Green Dragon'
              ? `\nMake your way to **${scoutArea.zone}**.\n⚠️ *DO NOT WAIT FOR SUMMONS.* ⚠️`
              : `\n⚠️ *DO NOT WAIT FOR SUMMONS.* ⚠️`
          }`
        ),
    confirmModal: (scoutArea, id) =>
      new ModalBuilder()
        .setCustomId(id)
        .setTitle('Send Boss Alert Again?')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setLabel(`Player with raid invite:`)
              .setStyle(TextInputStyle.Short)
              .setCustomId(InputName.TxtBossSpottedPartyLead)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setLabel(`Type 'Yes' to confirm:`)
              .setStyle(TextInputStyle.Short)
              .setCustomId(InputName.TxtBossSpottedConfirmPing)
          )
        ),
    modal: (scoutArea, id) =>
      new ModalBuilder()
        .setCustomId(id)
        .setTitle(
          `${
            scoutArea.type === 'Green Dragon' ? 'Green Dragons' : scoutArea.name
          } Spotted!`
        )
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setLabel('Player with raid invite:')
              .setStyle(TextInputStyle.Short)
              .setCustomId(InputName.TxtBossSpottedPartyLead)
          )
        )
  },
  ErrorAlreadyScouting: {
    getEmbed: (boss, scout) =>
      new EmbedBuilder()
        .setColor(Config.General.errorColor)
        .setTitle(`Already Scouting ${boss.name}`)
        .setDescription(
          `You are already signed up for scouting ${boss.name} (Since <t:${scout.startTime}:t>)\nIf you think this is in error, end your shift and start a new one.`
        )
        .setTimestamp(),

    getButtonRow: boss =>
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(boss.btnNames.stopScouting)
          .setLabel(`Stop Scouting`)
          .setEmoji('🛑')
          .setStyle(ButtonStyle.Secondary)
      )
  }
}
