const fs = require('fs');

function calculateRollValues(session) {
    console.log("TODO: Update guilds with proper 'rollMin' and 'rollMax' values");
    let rollRange = 1

    for (guildTag of session.attendance.keys()) {
        let sessionGuild = session.attendance.get(guildTag);
        sessionGuild.rollMin = rollRange;
        sessionGuild.rollMax = (rollRange + sessionGuild.attendance - 1);
        rollRange += sessionGuild.attendance;
    }

    session.roll = rollRange-1
}

function deleteLootSession(LootSessions, userId) {
    const deleteSession = LootSessions.get(userId);
    if (deleteSession != undefined) {
        deleteSession.message?.delete?.()
        LootSessions.remove(userId);
    } else {
        console.log("Not found...")
    }
}

module.exports = (DiscordClient) => {
    DiscordClient.calculateRollValues = calculateRollValues
    DiscordClient.deleteLootSession = deleteLootSession
}