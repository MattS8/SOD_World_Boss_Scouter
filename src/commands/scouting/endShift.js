const Config = require('../../config.js');
const CommandType = Config.Enums.CommandType;
const Bosses = Config.Bosses;
const Inputnames = Object.keys(Bosses).map(key => Bosses[key].btnNames.stopScouting);
const Utils = require('../../util.js');
const ScoutSessionViews = require('../../views/scoutSessionViews.js');

function interact(interaction, DiscordClient) {
    const ScoutSessions = DiscordClient.getScoutSessions(DiscordClient);
    const selectedBoss = Object.values(Config.Bosses).filter((boss) => boss.btnNames.stopScouting === interaction.customId)[0]
    const session = ScoutSessions.get(selectedBoss.name);

    if (session.currentScouts.has(interaction.user.id)) {
        const scout = session.currentScouts.get(interaction.user.id)
        console.log("TODO: save player's scout duration to google sheet. Also, log the end time in a scouting log channel.");
        scout.message?.delete?.()?.catch(console.error)
        session.currentScouts.remove(interaction.user.id);
        DiscordClient.updateScoutMainView(DiscordClient, selectedBoss.name);
        DiscordClient.deleteScoutErrorMessage(DiscordClient, interaction.user.id, selectedBoss.name);
        interaction?.deferUpdate();
    } else {
        console.warn(`Tried to stop session for user ${interaction.user.displayName}, however couldn't find them in the current session for boss ${selectedBoss.name}!`);
    }
}

module.exports = {
    inputNames: Inputnames,
    interact: interact,
    commandType: CommandType.ButtonCommand
}