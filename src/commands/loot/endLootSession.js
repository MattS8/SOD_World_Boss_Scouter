
const Config = require('../../config.js');
const InputName = require('../../constants.js').Enums.InputName;
const CommandType = require('../../constants.js').Enums.CommandType;

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