const Config = require('../../config.js')
const CommandType = require('../../constants.js').Enums.CommandType
const InputName = require('../../constants.js').Enums.InputName
const LootSessionViews = require('../../views/lootSessionViews.js')
const LootFunctions = require('../../main.js').DiscordClient.LootFunctions

function bossSelected (interaction, session, selectedBoss) {
  session.boss = selectedBoss
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
}

// -- Exports -- //
function interact (interaction) {
  const session = LootFunctions.getLootSessions().get(interaction.user.id)
  if (!session) {
    console.error(`Unable to find session under user ${interaction.user.id}!`)
    return
  }

  switch (interaction.customId) {
    case InputName.SelectLootBoss_Azuregos:
      bossSelected(interaction, session, Config.Bosses.Azuregos.name)
      break
    case InputName.SelectLootBoss_GreenDragons:
      session.message
        ?.edit?.({
          embeds: [LootSessionViews.GreenDragonSelection.embed],
          components: [LootSessionViews.GreenDragonSelection.buttonRow],
          ephemeral: true
        })
        .then(() => {
          interaction.deferUpdate()
        })
        .catch(console.error)
      break
    case InputName.SelectLootBoss_Kazzak:
      bossSelected(interaction, session, Config.Bosses.Kazzak.name)
      break
    case InputName.SelectLootBoss_Emriss:
      bossSelected(interaction, session, Config.Bosses.Emriss.name)
      break
    case InputName.SelectLootBoss_Taerar:
      bossSelected(interaction, session, Config.Bosses.Taerar.name)
      break
    case InputName.SelectLootBoss_Lethon:
      bossSelected(interaction, session, Config.Bosses.Lethon.name)
      break
    case InputName.SelectLootBoss_Ysondre:
      bossSelected(interaction, session, Config.Bosses.Ysondre.name)
      break
    default:
      console.error(
        `Unable to find loot action with customId ${interaction.customId}`
      )
  }
}

module.exports = {
  inputNames: [
    InputName.SelectLootBoss_Azuregos,
    InputName.SelectLootBoss_GreenDragons,
    InputName.SelectLootBoss_Kazzak,
    InputName.SelectLootBoss_Emriss,
    InputName.SelectLootBoss_Lethon,
    InputName.SelectLootBoss_Taerar,
    InputName.SelectLootBoss_Ysondre
  ],
  interact: interact,
  commandType: CommandType.ButtonCommand
}
