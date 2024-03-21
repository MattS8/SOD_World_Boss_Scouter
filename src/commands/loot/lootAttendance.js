const Config = require('../../config.js');
const ButtonName = Config.Enums.ButtonName;
const CommandType = Config.Enums.CommandType;
const LootSessionViews = require('../../views/lootSessionViews.js');

async function trySendingAttendanceModal(DiscordClient, interaction, guildTag, attempt) {
    if (attempt > 3) {
        console.warn("WARNING: Tried to send modal interaction more than 3 times! Aborting...");
        return
    }

    interaction.showModal(LootSessionViews.GuildAttendance.modal(Config.Guilds.filter((guild) => guild.tag === guildTag)[0]))
    .catch((error => {
        console.warn(`Failed sending modal... ${attempt}/3`);
        DiscordClient.sleep(500).then(() => trySendingAttendanceModal(interaction, guildTag, attempt+1))
    }))
}

function interact(interaction, DiscordClient) {
    const session = DiscordClient.LootSessions.get(interaction.user.id);
    if (!session) {
        console.error(`Unable to find session under user ${interaction.user.id}!`);
        return
    }

    // This is a hacky workaround because I can't seem to figure out how to properly
    // stop buttons from reporting that their "interaction failed" without sending 
    // a dummy reply.
    try {
        interaction.reply({ content: " ", fetchReply: false }).catch(console.error)
    } catch (e) { }

    switch (interaction.customId) {
        case ButtonName.LootGuildSelection:
            session.message?.edit?.({
                embeds: [LootSessionViews.GuildSelection.embed],
                components: [LootSessionViews.GuildSelection.buttonRow()],
                ephemeral: true
            }).catch(console.error);
            break;
        case ButtonName.LootGuildSelectionSelected:
            let guildTag = interaction.values[0]
            console.log(`Selected ${guildTag}!`)
            session.newAttendanceInput = {
                guildTag: guildTag
            }
            trySendingAttendanceModal(DiscordClient, interaction, guildTag, 1);
            break;
        case ButtonName.LootGuildAttendance:
            console.log(`INTERACTION: ${JSON.stringify(interaction, (key, value) =>
                typeof value === 'bigint'
                    ? value.toString()
                    : value // return everything else unchanged
            )}`)

            //Check input for valid number
            const attendanceInput = parseInt(interaction.components[0].components[0].value)
            if (isNaN(attendanceInput)) {
                console.error("Invalid number entered!");
                return
            }

            // Record guild's attendance
            console.log(`<${session.newAttendanceInput.guildTag}> had ${attendanceInput} members present!`);
            session.attendance.set(session.newAttendanceInput.guildTag, { attendance: attendanceInput });

            // Update roll values
            DiscordClient.calculateRollValues(session);

            // Show updated mainView
            session.message?.edit?.({
                embeds: [LootSessionViews.MainView.embed(session)],
                components: [LootSessionViews.MainView.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        default:
            console.error(`Unable to find guild loot attendance action with customId ${interaction.customId}`);
    }
}

module.exports = {
    btnNames: [ButtonName.LootGuildSelectionSelected, ButtonName.LootGuildSelection, ButtonName.LootGuildAttendance],
    interact: interact,
    commandType: CommandType.ButtonCommand
}