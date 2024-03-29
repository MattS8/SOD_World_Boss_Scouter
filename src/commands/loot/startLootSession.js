const HashMap = require('hashmap');
const Config = require('../../config.js')
const CommandType = Config.Enums.CommandType
const InputName = Config.Enums.InputName
const LootSessionViews = require('../../views/lootSessionViews.js');

// -- Exports -- //
function interact(interaction, DiscordClient) {
    const LootSessions = DiscordClient.getLootSessions(DiscordClient);
    // Ensure the user doesn't have another loot session going on
    if (DiscordClient.LootSessions.has(interaction.user.id)) {
        DiscordClient.deleteLootSession(LootSessions, interaction.user.id)
        // interaction.reply({
        //     embeds: [LootSessionViews.ErrorMultipleSessions.embed],
        //     ephemeral: true
        // }).then((message) => DiscordClient.handleTimedMessage(message.id, message, 10 * 1000))
        //     .catch(console.error)
    }
    interaction.reply({
        embeds: [LootSessionViews.BossSelection.embed],
        components: [LootSessionViews.BossSelection.buttonRow],
        ephemeral: true,
        fetchReply: false
    }).then((message) => {
        DiscordClient.getLootSessions(DiscordClient).set(interaction.user.id, {
            userId: interaction.user.id,
            message: message,
            attendance: new HashMap(),
            roll: 0
        })
        DiscordClient.handleTimedMessage(message.id, message, 30 * 60 * 1000, () => { DiscordClient.getLootSessions(DiscordClient).remove(interaction.user.id) })
    }).catch(console.error)
}

module.exports = {
    inputName: InputName.StartLootSession,
    interact: interact,
    commandType: CommandType.ButtonCommand
}