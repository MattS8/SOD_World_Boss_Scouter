const fs = require('fs')
const Config = require('../config.js')
const HashMap = require('hashmap')
const Utils = require('../util.js')
const ScoutSessionViews = require('../views/scoutSessionViews.js')
const DiscordClient = require('../main.js').DiscordClient
const Logging = DiscordClient.Logging
const Constants = require('../constants.js')
const ModalIdentifier = Constants.ModalIdentifier
const ConfirmIdentifier = Constants.ConfirmIdentifier

function getScoutSessions () {
  // Init ScoutSessions list
  if (!DiscordClient.ScoutSessions) {
    DiscordClient.ScoutSessions = new HashMap()
    Object.values(Config.Scouting).forEach(boss => {
      DiscordClient.ScoutSessions.set(boss.name, {
        boss: boss.name,
        currentScouts: new HashMap()
      })
    })
  }

  return DiscordClient.ScoutSessions
}

function getScoutErrorMessages (bossName) {
  const session = getScoutSessions().get(bossName)
  if (!session.errorMessages) {
    session.errorMessages = new HashMap()
  }

  return session.errorMessages
}

function deleteScoutErrorMessage (userId, bossName) {
  const errorMsg = getScoutErrorMessages(bossName).get(userId)
  errorMsg?.delete?.().catch(console.error)
  getScoutErrorMessages(bossName).remove(userId)
}

function updateScoutMainView (bossName) {
  const session = getScoutSessions().get(bossName)
  const boss = Utils.getScoutBoss(bossName)
  session.message
    .edit({
      embeds: [ScoutSessionViews.MainView.getEmbed(boss, session)],
      components: [ScoutSessionViews.MainView.getButtonRow(boss)]
    })
    .catch(console.error)
}

async function showBossConfirmModal (interaction, selectedSession) {
  interaction
    .showModal(
      ScoutSessionViews.BossSpotted.confirmModal(
        selectedSession,
        `${interaction.customId}${ConfirmIdentifier}`
      )
    )
    .catch(error =>
      console.error(`Failed to show BossSpotted modal!\n${error}`)
    )
}

async function processBossSpottedInfo (interaction) {
  if (!interaction.components[0]?.components[0]?.value) {
    console.error('Party leader input error!')
    return
  }

  const fltr = s =>
    `${s.btnNames.bossSpotted}${ModalIdentifier}` === interaction.customId
  const selectedSession = Object.values(Config.Scouting).filter(fltr)[0]
  const session = getScoutSessions().get(selectedSession.name)
  session.partyLeader = interaction.components[0].components[0].value
  const displayName = interaction.member.displayName
  sendBossAlert(interaction, selectedSession, session)
  Logging.logBossSpotted(selectedSession, displayName)
  session.IsUp = true
  console.log(
    'TODO: Set timer to check if boss has been marked as killed. If not, send a reminder to the person who spotted to mark as killed.'
  )
}

async function fetchBossSpottedInfo (interaction) {
  const fltr = s =>
    s.btnNames.bossSpotted === interaction.customId ||
    `${s.btnNames.bossSpotted}${ConfirmIdentifier}` === interaction.customId
  const selectedSession = Object.values(Config.Scouting).filter(fltr)[0]
  interaction
    .showModal(
      ScoutSessionViews.BossSpotted.modal(
        selectedSession,
        `${interaction.customId}${ModalIdentifier}`
      )
    )
    .catch(error =>
      console.error(`Failed to show BossSpotted modal!\n${error}`)
    )
}

async function sendBossAlert (interaction) {
  const fltr = s =>
    `${s.btnNames.bossSpotted}${ConfirmIdentifier}` === interaction.customId ||
    `${s.btnNames.bossSpotted}${ModalIdentifier}` === interaction.customId
  const selectedSession = Object.values(Config.Scouting).filter(fltr)[0]
  const session = getScoutSessions().get(selectedSession.name)
  const channel = await Utils.getChannelFromId(Config.Server.channels.alert.id)
  if (!channel) return

  channel
    .send({
      embeds: [
        ScoutSessionViews.BossSpotted.getEmbed(
          selectedSession,
          session.partyLeader
        )
      ]
    })
    .then(() => {
      interaction?.deferUpdate()
    })
    .catch(error => console.error(`Failed to send boss alert:\n${error}`))
}

module.exports = DiscordClient => {
  DiscordClient.ScoutFunctions = {
    getScoutSessions: getScoutSessions,
    updateScoutMainView: updateScoutMainView,
    getScoutErrorMessages: getScoutErrorMessages,
    deleteScoutErrorMessage: deleteScoutErrorMessage,
    processBossSpottedInfo: processBossSpottedInfo,
    fetchBossSpottedInfo: fetchBossSpottedInfo,
    sendBossAlert: sendBossAlert,
    showBossConfirmModal: showBossConfirmModal
  }
}
