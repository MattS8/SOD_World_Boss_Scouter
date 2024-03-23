const Config = require('../../config.js');
const CommandType = Config.Enums.CommandType;
const Bosses = Config.Bosses;
const Inputnames = Object.keys(Bosses).map(key => Bosses[key].btnNames.scouting);
const Utils = require('../../util.js');
const ScoutSessionViews = require('../../views/scoutSessionViews.js');

function interact(interaction, DiscordClient) {
    const ScoutSessions = DiscordClient.getScoutSessions(DiscordClient);
    const selectedBoss = Object.values(Config.Bosses).filter((boss) => boss.btnNames.scouting === interaction.customId)[0]
    const session = ScoutSessions.get(selectedBoss.name);
    if (session.currentScouts.has(interaction.user.id)) {
        console.log(`User with id <${interaction.user.id}> tried to begin shift while already scouting!`);
        interaction.reply({
            embeds: [ScoutSessionViews.ErrorAlreadyScouting.getEmbed(selectedBoss, session.currentScouts.get(interaction.user.id))],
            components: [ScoutSessionViews.ErrorAlreadyScouting.getButtonRow(selectedBoss)],
            ephemeral: true
        }).then((message) => DiscordClient.handleTimedMessage(message.id, message, 10 * 1000))
            .catch(console.error)
        return
    }

    console.log(`User <${interaction.user.displayName}> has begun scouting ${session.boss} at ${new Date().toLocaleString("en-US", Config.General.dateFormats.defaultFormat)}!`)
    interaction.reply({
        embeds: [ScoutSessionViews.ScoutingOptions.getEmbed(selectedBoss)],
        components: [ScoutSessionViews.ScoutingOptions.getButtonRow(selectedBoss)],
        ephemeral: true,
        fetchReply: false
    }).then((message) => {
        console.log("TODO: Update main view to show current scouts!");
        session.currentScouts.set(interaction.user.id, {
            user: interaction.user,
            guild: Utils.getGuild(interaction.user.id, DiscordClient),
            startTime: new Date().getTime(),
            message: message
        })
    }).catch(console.error)

}

module.exports = {
    inputNames: Inputnames,
    interact: interact,
    commandType: CommandType.ButtonCommand
}