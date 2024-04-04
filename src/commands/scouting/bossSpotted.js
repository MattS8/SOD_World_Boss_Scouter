const Config = require('../../config.js')
const DiscordClient = require('../../main.js').DiscordClient
const Logging = DiscordClient.Logging
const ScoutFunctions = DiscordClient.ScoutFunctions
const Utils = require('../../util.js')
const ScoutSessionViews = require('../../views/scoutSessionViews.js')
const Constants = require('../../constants.js')
const CommandType = Constants.Enums.CommandType
const ModalIdentifier = Constants.ModalIdentifier
const ConfirmIdentifier = Constants.ConfirmIdentifier
const Inputnames = []
// Initialize input names for modals and for button presses
for (key of Object.keys(Config.Scouting)) {
  const baseID = Config.Scouting[key].btnNames.bossSpotted
  Inputnames.push(baseID)
  Inputnames.push(`${baseID}${ModalIdentifier}`)
  Inputnames.push(`${baseID}${ConfirmIdentifier}`)
}

async function interact (interaction) {
  if (!Inputnames.includes(interaction.customId)) {
    const warningMsg = `Unable to find bossSpotted action with id ${interaction.customId}!`
    console.warn(warningMsg)
    return
  }

  if (interaction.customId.includes(ModalIdentifier)) {
    // Boss info inputted
    ScoutFunctions.processBossSpottedInfo(interaction)
  } else if (
    interaction.customId.includes(ConfirmIdentifier) &&
    interaction.components[1].components[0].value?.toLowerCase?.() === 'yes'
  ) {
    // Confirmed to resend alert
    const fltr = s => `${s.btnNames.bossSpotted}${ConfirmIdentifier}` === interaction.customId
    const selectedSession = Object.values(Config.Scouting).filter(fltr)[0]
    const session = ScoutFunctions.getScoutSessions().get(selectedSession.name)
    session.partyLeader = interaction.components[0].components[0].value
    ScoutFunctions.sendBossAlert(interaction)
  } else {
    // Boss spotted button clicked
    const fltr = s => s.btnNames.bossSpotted === interaction.customId
    const selectedSession = Object.values(Config.Scouting).filter(fltr)[0]
    const session = ScoutFunctions.getScoutSessions().get(selectedSession.name)
    if (session.IsUp) {
      // Already spotted so we need to confirm to send another alert
      const warningMsg = `Warning: Attempted to trigger boss spotted for ${selectedSession.name}, however it was previously triggered.`
      console.warn(warningMsg)
      ScoutFunctions.showBossConfirmModal(interaction, selectedSession)
    } else {
      ScoutFunctions.fetchBossSpottedInfo(interaction)
    }
  }
}

module.exports = {
  inputNames: Inputnames,
  interact: interact,
  commandType: CommandType.ButtonCommand
}
