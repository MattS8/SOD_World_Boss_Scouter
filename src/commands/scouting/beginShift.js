const Config = require('../../config.js');
const CommandType = require('../../constants.js').Enums.CommandType;
const Bosses = Config.Bosses;
const Inputnames = Object.keys(Bosses).map(key => Bosses[key].btnNames.scouting);
const Utils = require('../../util.js');
const ScoutSessionViews = require('../../views/scoutSessionViews.js');

async function interact(interaction, DiscordClient) {
    const ScoutSessions = DiscordClient.getScoutSessions(DiscordClient);
    const selectedBoss = Object.values(Config.Bosses).filter((boss) => boss.btnNames.scouting === interaction.customId)[0]
    const session = ScoutSessions.get(selectedBoss.name);
    if (session.currentScouts.has(interaction.user.id)) {
        console.warn(`User with id <${interaction.user.id}> tried to begin shift while already scouting!`);
        DiscordClient.deleteScoutErrorMessage(DiscordClient, interaction.user.id, selectedBoss.name);

        interaction.reply({
            embeds: [ScoutSessionViews.ErrorAlreadyScouting.getEmbed(selectedBoss, session.currentScouts.get(interaction.user.id))],
            components: [ScoutSessionViews.ErrorAlreadyScouting.getButtonRow(selectedBoss)],
            ephemeral: true
        }).then((message) => {
            DiscordClient.handleTimedMessage(message.id, message, 20 * 1000)
            DiscordClient.getScoutErrorMessages(DiscordClient, selectedBoss.name).set(interaction.user.id, message);
        })
            .catch(console.error);
        return
    }

    console.log(`User <${interaction.user.displayName}> has begun scouting ${session.boss} at ${new Date().toLocaleString("en-US", Config.General.dateFormats.defaultFormat)}!`)
    interaction.reply({
        embeds: [ScoutSessionViews.ScoutingOptions.getEmbed(selectedBoss)],
        components: [ScoutSessionViews.ScoutingOptions.getButtonRow(selectedBoss)],
        ephemeral: true,
        fetchReply: false
    }).then((message) => {
        Utils.getGuild(interaction.user.id, DiscordClient, (userGuild) => {
            session.currentScouts.set(interaction.user.id, {
                user: interaction.user,
                guildName: userGuild.name,
                guildColor: userGuild.color,
                startTime: Math.round(new Date().getTime() / 1000),
                message: message
            });
            DiscordClient.updateScoutMainView(DiscordClient, selectedBoss.name);
        });
    }).catch(console.error)

}

module.exports = {
    inputNames: Inputnames,
    interact: interact,
    commandType: CommandType.ButtonCommand
}