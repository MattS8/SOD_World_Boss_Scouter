const Config = require('../../config.js')
const InputName = require('../../constants.js').Enums.InputName
const CommandType = require('../../constants.js').Enums.CommandType
const LootFunctions = require('../../main.js').DiscordClient.LootFunctions

function interact (interaction) {
  const lootSesssions = LootFunctions.getLootSessions()
  if (lootSesssions?.has(interaction.user.id)) {
    const toDelete = lootSesssions.get(interaction.user.id)
    toDelete.message?.delete?.()
    lootSesssions.remove(interaction.user.id)
  }
}

module.exports = {
  inputName: InputName.EndLootSession,
  interact: interact,
  commandType: CommandType.ButtonCommand
}
