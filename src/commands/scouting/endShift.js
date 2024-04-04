const Config = require('../../config.js');
const CommandType = require('../../constants.js').Enums.CommandType;
const Inputnames = Object.keys(Config.Scouting).map(key => Config.Scouting[key].btnNames.stopScouting);

function interact(interaction, DiscordClient) {
    const ScoutSessions = DiscordClient.getScoutSessions();
    const selectedSession = Object.values(Config.Scouting).filter((s) => s.btnNames.stopScouting === interaction.customId)[0]
    const session = ScoutSessions.get(selectedSession.name);

    if (session.currentScouts.has(interaction.user.id)) {
        const scout = session.currentScouts.get(interaction.user.id)
        const newBossTime = {}
        newBossTime[selectedSession.name] = Math.round((new Date().getTime() / 1000) - scout.startTime);
        console.log(`Adding ${newBossTime[selectedSession.name]} seconds to ${selectedSession.name} for ${scout.user.displayName}`);
        DiscordClient.GoogleSheetFunctions.Scouting.updateScout(interaction.user, interaction.member.displayName, scout.guildTag, newBossTime);
        scout.message?.delete?.()?.catch(console.error)
        session.currentScouts.remove(interaction.user.id);
        DiscordClient.updateScoutMainView(DiscordClient, selectedSession.name);
        DiscordClient.Logging.logEndShift(selectedSession.name, new Date().getTime(), newBossTime[selectedSession.name], interaction.member.displayName);
        DiscordClient.deleteScoutErrorMessage(DiscordClient, interaction.user.id, selectedSession.name);
        interaction?.deferUpdate();
    } else {
        console.warn(`Tried to stop session for user ${interaction.user.displayName}, however couldn't find them in the current session for boss ${selectedSession.name}!`);
    }
}

module.exports = {
    inputNames: Inputnames,
    interact: interact,
    commandType: CommandType.ButtonCommand
}