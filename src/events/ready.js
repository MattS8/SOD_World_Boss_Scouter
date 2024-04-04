const {
  Events,
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder
} = require('discord.js')
const fs = require('fs')
const Config = require('../config.js')
const LootSessionViews = require('../views/lootSessionViews.js')
const ScoutSessionViews = require('../views/scoutSessionViews.js')
const { channel } = require('diagnostics_channel')
const DiscordClient = require('../main.js').DiscordClient
const ScoutFunctions = DiscordClient.ScoutFunctions
require('dotenv').config()

function execute (clientInfo) {
  DiscordClient.user.setActivity('SPIRIT OF AZUREGOS HAS SPAWNED!!!')

  // Register Commands
  const commandFolders = fs.readdirSync('./src/commands')
  DiscordClient.handleCommands(commandFolders, './src/commands')

  if (process.env.SEND_INITIAL_MESSAGES === 'true') {
    // Loot Channel
    DiscordClient.channels
      .fetch(Config.Server.channels.loot.id)
      .then(channel => {
        channel.send({
          embeds: [LootSessionViews.GetStarted.embed],
          components: [LootSessionViews.GetStarted.buttonRow],
          fetchReply: false
        })
      })
      .catch(console.error)

    // Boss Scouting Channels
    Object.values(Config.Scouting).forEach(boss => {
      DiscordClient.channels
        .fetch(boss.channel)
        .then(channel => {
          channel
            .send({
              embeds: [
                ScoutSessionViews.MainView.getEmbed(
                  boss,
                  ScoutFunctions.getScoutSessions().get(boss.name)
                )
              ],
              components: [ScoutSessionViews.MainView.getButtonRow(boss)],
              fetchReply: false
            })
            .then(message => {
              ScoutFunctions.getScoutSessions().get(boss.name).message = message
            })
        })
        .catch(console.error)
    })
  } else {
    Object.values(Config.Scouting).forEach(boss => {
      DiscordClient.channels.fetch(boss.channel).then(channel => {
        channel.messages.fetch().then(msgs => {
          let scoutMessage = undefined
          msgs.map(msg => {
            // console.log(`\t${JSON.stringify(msg["author"]["id"])} || ${DiscordClient.user.id}`)
            if (msg.author.id == DiscordClient.user.id) scoutMessage = msg
          })
          // console.log(`messages: ${JSON.stringify(msgs)} || ${DiscordClient.user.id}\n\n`)
          // const scoutMessage = msgs.embeds?.filter(message => message.author.id == `${DiscordClient.user.id}`)[0]
          if (scoutMessage) {
            ScoutFunctions.getScoutSessions().get(boss.name).message =
              scoutMessage
          } else {
            console.error(
              `ERROR: Unable to find initial message for scouting ${boss.name}. Did you forget to enable initial message in the .env file?`
            )
          }
        })
      })
    })
  }
}

module.exports = {
  name: Events.ClientReady,
  execute: execute
}
