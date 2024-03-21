
const Config = require('../../config.js');
const ButtonName = Config.Enums.ButtonName;
const CommandType = Config.Enums.CommandType;

function interact(interaction, DiscordClient) {
    if (DiscordClient.LootSessions?.has(interaction.user.id)) {
        const toDelete = DiscordClient.LootSessions.get(interaction.user.id);
        toDelete.message?.delete?.()
        DiscordClient.LootSessions.remove(interaction.user.id);
    }
}

module.exports = {
    btnName: ButtonName.EndLootSession,
    interact: interact,
    commandType: CommandType.ButtonCommand
}