
const Config = require('../../config.js');
const InputName = Config.Enums.InputName;
const CommandType = Config.Enums.CommandType;

function interact(interaction, DiscordClient) {
    const LootSessions = DiscordClient.getLootSessions(DiscordClient);
    if (LootSessions?.has(interaction.user.id)) {
        const toDelete = LootSessions.get(interaction.user.id);
        toDelete.message?.delete?.()
        LootSessions.remove(interaction.user.id);
    }
}

module.exports = {
    inputName: InputName.EndLootSession,
    interact: interact,
    commandType: CommandType.ButtonCommand
}