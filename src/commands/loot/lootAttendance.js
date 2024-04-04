const Config = require('../../config.js')
const InputName = require('../../constants.js').Enums.InputName
const CommandType = require('../../constants.js').Enums.CommandType
const LootSessionViews = require('../../views/lootSessionViews.js')
const LootFunctions = require('../../main.js').DiscordClient.LootFunctions
function interact (interaction) {
  const session = LootFunctions.getLootSessions().get(interaction.user.id)
  if (!session) {
    console.error(`Unable to find session under user ${interaction.user.id}!`)
    return
  }

  switch (interaction.customId) {
    case InputName.LootBackToMainView:
      LootFunctions.showMainLootWindow(session, interaction)
      break
    case InputName.LootGuildSelection:
      session.message
        ?.edit?.({
          embeds: [LootSessionViews.GuildSelection.embed],
          components: [
            LootSessionViews.GuildSelection.buttonRow(),
            LootSessionViews.GuildSelection.backRow
          ],
          ephemeral: true
        })
        .then(() => {
          interaction.deferUpdate()
        })
        .catch(console.error)

      break
    case InputName.LootGuildSelectionSelected:
      let guildTag = interaction.values[0]
      session.newAttendanceInput = {
        guildTag: guildTag
      }
      LootFunctions.trySendingAttendanceModal(session, interaction, guildTag, 1)
      break
    case InputName.LootGuildAttendance:
      //Check input for valid number
      const attendanceInput = parseInt(
        interaction.components[0].components[0].value
      )
      if (!isNaN(attendanceInput)) {
        // Remove guild from attendance if 0 (or less, I guess) players attended
        if (attendanceInput < 1) {
          session.attendance.remove(session.newAttendanceInput.guildTag)
        } else {
          session.attendance.set(session.newAttendanceInput.guildTag, {
            attendance: attendanceInput
          })
        }

        // Update roll values
        LootFunctions.calculateRollValues(session)

        // Reply
        // Show updated mainView
        session.message
          ?.edit?.({
            embeds: [LootSessionViews.MainView.embed(session)],
            components: [LootSessionViews.MainView.buttonRow],
            ephemeral: true
          })
          .then(() => {
            interaction.deferUpdate()
          })
          .catch(console.error)
      } else {
        console.error('Invalid number entered!')
      }
      break
    default:
      console.error(
        `Unable to find guild loot attendance action with customId ${interaction.customId}`
      )
  }
}

module.exports = {
  inputNames: [
    InputName.LootGuildSelectionSelected,
    InputName.LootGuildSelection,
    InputName.LootGuildAttendance,
    InputName.LootBackToMainView
  ],
  interact: interact,
  commandType: CommandType.ButtonCommand
}
