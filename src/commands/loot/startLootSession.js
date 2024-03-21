const HashMap = require('hashmap');
const Config = require('../../config.js')
const CommandType = Config.Enums.CommandType
const ButtonName = Config.Enums.ButtonName
const LootSessionViews = require('../../views/lootSessionViews.js');

// -- Exports -- //
function interact(interaction, DiscordClient) {
    // Init LootSessions list
    if (!DiscordClient.LootSessions) {
        DiscordClient.LootSessions = new HashMap();
        console.log("Initializing LootSessions Map...");
    }

    // Ensure the user doesn't have another loot session going on
    if (DiscordClient.LootSessions.has(interaction.user.id)) {
        interaction.reply({
            embeds: [LootSessionViews.ErrorMultipleSessions.embed],
            ephemeral: true
        }).then((message) => DiscordClient.handleTimedMessage(message.id, message, 10 * 1000))
            .catch(console.error)
    } else {
        interaction.reply({
            embeds: [LootSessionViews.BossSelection.embed],
            components: [LootSessionViews.BossSelection.buttonRow],
            ephemeral: true,
            fetchReply: false
        }).then((message) => {
            DiscordClient.LootSessions.set(interaction.user.id, {
                userId: interaction.user.id,
                message: message,
                attendance: new HashMap(),
                roll: 0
            })
            DiscordClient.handleTimedMessage(message.id, message, 30 * 60 * 1000, () => { DiscordClient.LootSessions.remove(interaction.user.id) })
        })
            .catch(console.error)
    }
}

module.exports = {
    btnName: ButtonName.StartLootSession,
    interact: interact,
    commandType: CommandType.ButtonCommand
}