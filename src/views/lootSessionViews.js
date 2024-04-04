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
const Config = require('../config.js')
const { StringSelectMenuOptionBuilder } = require('@discordjs/builders')
const InputName = require('../constants.js').Enums.InputName
const Guilds = Config.Guilds

module.exports = {
  GetStarted: {
    embed: new EmbedBuilder()
      .setColor(0xa2810d)
      .setTitle('Start a Loot Session')
      .setDescription(
        'Click the button below to create a new loot session and determine roll ranges for each guild based on participation.'
      ),
    buttonRow: new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(InputName.StartLootSession)
        .setLabel('Start')
        .setEmoji('➡️')
        .setStyle(ButtonStyle.Primary)
    )
  },
  GreenDragonSelection: {
    embed: new EmbedBuilder()
      .setColor(0xa2810d)
      .setTitle('Select Green Dragon')
      .setDescription('Which green dragon is this loot from?')
      .setTimestamp(),
    buttonRow: new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(InputName.SelectLootBoss_Emriss)
        .setLabel(Config.Bosses.Emriss.name)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(InputName.SelectLootBoss_Lethon)
        .setLabel(Config.Bosses.Lethon.name)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(InputName.SelectLootBoss_Taerar)
        .setLabel(Config.Bosses.Taerar.name)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(InputName.SelectLootBoss_Ysondre)
        .setLabel(Config.Bosses.Ysondre.name)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(InputName.EndLootSession)
        .setLabel('Close')
        .setStyle(ButtonStyle.Danger)
    )
  },
  BossSelection: {
    embed: new EmbedBuilder()
      .setColor(0xa2810d)
      .setTitle('Select Boss')
      .setDescription('Which boss is this loot from?')
      .setTimestamp(),
    buttonRow: new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(InputName.SelectLootBoss_Azuregos)
        .setLabel(Config.Bosses.Azuregos.name)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(InputName.SelectLootBoss_Kazzak)
        .setLabel(Config.Bosses.Kazzak.name)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(InputName.SelectLootBoss_GreenDragons)
        .setLabel('Green Dragon')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(InputName.EndLootSession)
        .setLabel('Close')
        .setStyle(ButtonStyle.Danger)
    )
  },
  MainView: {
    embed: session => {
      let mainViewEmbed = new EmbedBuilder()
        .setColor(0xa2810d)
        .setTitle(`Loot for ${session.boss}:`)
        .setDescription(`Roll Command: \`/roll ${session.roll}\``)
        .setTimestamp()
        .addFields({ name: '\u200B', value: '\u200B' })
      for (guild of session.attendance.keys()) {
        let sessionInfo = session.attendance.get(guild)
        mainViewEmbed.addFields({
          name: `<${guild}> (${sessionInfo.attendance} player${
            sessionInfo.attendance > 1 ? 's' : ''
          })`,
          value: `${sessionInfo.rollMin} - ${sessionInfo.rollMax}`,
          inline: true
        })
      }

      return mainViewEmbed
    },
    buttonRow: new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(InputName.LootGuildSelection)
        .setLabel('Add Guild')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(InputName.EndLootSession)
        .setLabel('Close')
        .setStyle(ButtonStyle.Danger)
    )
  },
  GuildSelection: {
    embed: new EmbedBuilder()
      .setColor(0xa2810d)
      .setTitle('Select a Guild')
      .setDescription(
        `*If a guild is missing from selection, please dm ${Config.General.botOwner}.*`
      )
      .setTimestamp(),
    buttonRow: () => {
      const options = []
      for (guild of Config.Guilds) {
        options.push(
          new StringSelectMenuOptionBuilder()
            .setLabel(guild.name)
            .setValue(guild.tag)
        )
      }
      return new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(InputName.LootGuildSelectionSelected)
          .setPlaceholder('Choose a guild!')
          .addOptions(options)
      )
    },
    backRow: new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(InputName.LootBackToMainView)
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary)
    )
  },
  GuildAttendance: {
    modal: guild => {
      return new ModalBuilder()
        .setCustomId(InputName.LootGuildAttendance)
        .setTitle(`<${guild.name}> Members Present`)
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setLabel('Number of Players')
              .setStyle(TextInputStyle.Short)
              .setCustomId(InputName.TxtGuildAttendance)
          )
        )
    }
  },
  ErrorMultipleSessions: {
    embed: new EmbedBuilder()
      .setColor(Config.General.errorColor)
      .setTitle('Loot Session Already Running')
      .setDescription(
        'You already have a loot session started. Are you sure you want to end the previous session and start a new one?'
      )
      .setTimestamp(),
    buttonRow: new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(InputName.StartNewLootSession)
        .setLabel('Start New Session')
        .setStyle(ButtonStyle.Danger)
    )
  }
}
