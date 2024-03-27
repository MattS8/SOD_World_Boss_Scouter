const Config = require('../../config.js');
const InputName = Config.Enums.InputName;
const CommandType = Config.Enums.CommandType;
const LootSessionViews = require('../../views/lootSessionViews.js');

function showMainView(session, interaction) {
    session.message?.edit?.({
        embeds: [LootSessionViews.MainView.embed(session)],
        components: [LootSessionViews.MainView.buttonRow],
        ephemeral: true
    }).then(() => { interaction?.deferUpdate(); }).catch(console.error);
}

async function trySendingAttendanceModal(DiscordClient, session, interaction, guildTag, attempt) {
    if (attempt > 3) {
        console.warn("WARNING: Tried to send modal interaction more than 3 times! Aborting...");
        // Show mainView I guess
        showMainView(session, interaction);
        return
    }

    const guild = Config.Guilds.filter((guild) => guild.tag === guildTag)[0]
    if (guild != undefined) {
        interaction.showModal(LootSessionViews.GuildAttendance.modal(guild))
            .catch((error => {
                console.warn(`Failed sending modal... ${attempt}/3`);
                trySendingAttendanceModal(DiscordClient, session, interaction, guildTag, attempt + 1)
            }));
    } else {
        console.error(`Unable to find guild with tag: ${guildTag}`);
        showMainView(session,interaction);
    }

}

function interact(interaction, DiscordClient) {
    const session = DiscordClient.getLootSessions(DiscordClient).get(interaction.user.id);
    if (!session) {
        console.error(`Unable to find session under user ${interaction.user.id}!`);
        return
    }

    switch (interaction.customId) {
        case InputName.LootBackToMainView:
            showMainView(session, interaction);
            break;
        case InputName.LootGuildSelection:
            session.message?.edit?.({
                embeds: [LootSessionViews.GuildSelection.embed],
                components: [LootSessionViews.GuildSelection.buttonRow(), LootSessionViews.GuildSelection.backRow],
                ephemeral: true
            }).then(() => { interaction.deferUpdate(); }).catch(console.error);

            break;
        case InputName.LootGuildSelectionSelected:
            let guildTag = interaction.values[0]
            session.newAttendanceInput = {
                guildTag: guildTag
            }
            trySendingAttendanceModal(DiscordClient, session, interaction, guildTag, 1);
            break;
        case InputName.LootGuildAttendance:
            //Check input for valid number
            const attendanceInput = parseInt(interaction.components[0].components[0].value)
            if (!isNaN(attendanceInput)) {
                // Remove guild from attendance if 0 (or less, I guess) players attended
                if (attendanceInput < 1) {
                    session.attendance.remove(session.newAttendanceInput.guildTag);
                } else {
                    session.attendance.set(session.newAttendanceInput.guildTag, { attendance: attendanceInput });
                }

                // Update roll values
                DiscordClient.calculateRollValues(session);

                // Reply
                // Show updated mainView
                session.message?.edit?.({
                    embeds: [LootSessionViews.MainView.embed(session)],
                    components: [LootSessionViews.MainView.buttonRow],
                    ephemeral: true
                })
                .then(() => {interaction.deferUpdate();})
                .catch(console.error); 
            } else {
                console.error("Invalid number entered!");
            }
            break;
        default:
            console.error(`Unable to find guild loot attendance action with customId ${interaction.customId}`);
    }
}

module.exports = {
    inputNames: [InputName.LootGuildSelectionSelected, InputName.LootGuildSelection, InputName.LootGuildAttendance, InputName.LootBackToMainView],
    interact: interact,
    commandType: CommandType.ButtonCommand
}