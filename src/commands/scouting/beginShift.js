const Config = require('../../config.js');
const CommandType = require('../../constants.js').Enums.CommandType;
const Inputnames = Object.keys(Config.Scouting).map(key => Config.Scouting[key].btnNames.scouting);
const Utils = require('../../util.js');
const ScoutSessionViews = require('../../views/scoutSessionViews.js');

async function interact(interaction, DiscordClient) {
    const ScoutSessions = DiscordClient.getScoutSessions();
    const selectedSession = Object.values(Config.Scouting).filter((scoutArea) => scoutArea.btnNames.scouting === interaction.customId)[0]
    const session = ScoutSessions.get(selectedSession.name);
    if (session.currentScouts.has(interaction.user.id)) {
        console.warn(`User with id <${interaction.user.id}> tried to begin shift while already scouting!`);
        DiscordClient.deleteScoutErrorMessage(DiscordClient, interaction.user.id, selectedSession.name);

        interaction.reply({
            embeds: [ScoutSessionViews.ErrorAlreadyScouting.getEmbed(selectedSession, session.currentScouts.get(interaction.user.id))],
            components: [ScoutSessionViews.ErrorAlreadyScouting.getButtonRow(selectedSession)],
            ephemeral: true
        }).then((message) => {
            DiscordClient.handleTimedMessage(message.id, message, 20 * 1000)
            DiscordClient.getScoutErrorMessages(DiscordClient, selectedSession.name).set(interaction.user.id, message);
        })
            .catch(console.error);
        return
    }

    interaction.reply({
        embeds: [ScoutSessionViews.ScoutingOptions.getEmbed(selectedSession)],
        components: [ScoutSessionViews.ScoutingOptions.getButtonRow(selectedSession)],
        ephemeral: true,
        fetchReply: false
    }).then((message) => {
        Utils.getGuild(interaction.user.id, DiscordClient, (userGuild) => {
            const startTime = 
            session.currentScouts.set(interaction.user.id, {
                user: interaction.user,
                guildTag: userGuild.tag,
                guildColor: userGuild.color,
                startTime: Math.round(new Date().getTime() / 1000),
                message: message
            });
            DiscordClient.updateScoutMainView(DiscordClient, selectedSession.name);
            DiscordClient.Logging.logBeginShift(selectedSession.name, new Date().getTime(), interaction.member.displayName);
        });
    }).catch(console.error)

}

module.exports = {
    inputNames: Inputnames,
    interact: interact,
    commandType: CommandType.ButtonCommand
}