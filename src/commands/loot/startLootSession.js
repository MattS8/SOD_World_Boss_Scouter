const HashMap = require('hashmap')
const Config = require('../../config.js')
const CommandType = require('../../constants.js').Enums.CommandType
const InputName = require('../../constants.js').Enums.InputName
const LootSessionViews = require('../../views/lootSessionViews.js')
const DiscordClient = require('../../main.js').DiscordClient
const LootFunctions = DiscordClient.LootFunctions

// -- Exports -- //
function interact (interaction) {
  const lootSessions = LootFunctions.getLootSessions()
  // Ensure the user doesn't have another loot session going on
  if (lootSessions.has(interaction.user.id)) {
    LootFunctions.deleteLootSession(lootSessions, interaction.user.id)
  }
  interaction
    .reply({
      embeds: [LootSessionViews.BossSelection.embed],
      components: [LootSessionViews.BossSelection.buttonRow],
      ephemeral: true,
      fetchReply: false
    })
    .then(message => {
      LootFunctions.getLootSessions().set(interaction.user.id, {
        userId: interaction.user.id,
        message: message,
        attendance: new HashMap(),
        roll: 0
      })
      DiscordClient.handleTimedMessage(
        message.id,
        message,
        30 * 60 * 1000,
        () => {
          LootFunctions.getLootSessions().remove(interaction.user.id)
        }
      )
    })
    .catch(console.error)
}

module.exports = {
  inputName: InputName.StartLootSession,
  interact: interact,
  commandType: CommandType.ButtonCommand
}
