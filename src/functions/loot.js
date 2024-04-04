const fs = require('fs')
const HashMap = require('hashmap')
const DiscordClient = require('../main.js').DiscordClient
const LootSessionViews = require('../views/lootSessionViews.js')
const Config = require('../config.js')

function getLootSessions () {
  if (!DiscordClient.LootSessions) {
    DiscordClient.LootSessions = new HashMap()
  }

  return DiscordClient.LootSessions
}

function calculateRollValues (session) {
  let rollRange = 1

  for (guildTag of session.attendance.keys()) {
    let sessionGuild = session.attendance.get(guildTag)
    sessionGuild.rollMin = rollRange
    sessionGuild.rollMax = rollRange + sessionGuild.attendance - 1
    rollRange += sessionGuild.attendance
  }

  session.roll = rollRange - 1
}

function deleteLootSession (LootSessions, userId) {
  const deleteSession = LootSessions.get(userId)
  if (deleteSession != undefined) {
    deleteSession.message?.delete?.()
    LootSessions.remove(userId)
  } else {
    console.error(`Loot session not found for user w/id ${userId}!`)
  }
}

function showMainLootWindow (session, interaction) {
  session.message
    ?.edit?.({
      embeds: [LootSessionViews.MainView.embed(session)],
      components: [LootSessionViews.MainView.buttonRow],
      ephemeral: true
    })
    .then(() => {
      interaction?.deferUpdate()
    })
    .catch(console.error)
}

function trySendingAttendanceModal (session, interaction, guildTag, attempt) {
  if (attempt > 3) {
    console.warn(
      'WARNING: Tried to send modal interaction more than 3 times! Aborting...'
    )
    // Show mainView I guess
    showMainLootWindow(session, interaction)
    return
  }

  const guild = Config.Guilds.filter(guild => guild.tag === guildTag)[0]
  if (guild != undefined) {
    interaction
      .showModal(LootSessionViews.GuildAttendance.modal(guild))
      .catch(error => {
        console.warn(`(!) Failed sending modal... ${attempt}/3`)
        trySendingAttendanceModal(session, interaction, guildTag, attempt + 1)
      })
  } else {
    console.error(`Unable to find guild with tag: ${guildTag}`)
    showMainLootWindow(session, interaction)
  }
}

module.exports = DiscordClient => {
  DiscordClient.LootFunctions = {
    calculateRollValues: calculateRollValues,
    deleteLootSession: deleteLootSession,
    getLootSessions: getLootSessions,
    showMainLootWindow: showMainLootWindow,
    trySendingAttendanceModal: trySendingAttendanceModal
  }
}
