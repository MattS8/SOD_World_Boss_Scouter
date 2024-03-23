const fs = require('fs');
const Config = require('../config.js');
const HashMap = require('hashmap');

function getScoutSessions(DiscordClient) {
    // Init ScoutSessions list
    if (!DiscordClient.ScoutSessions) {
        DiscordClient.ScoutSessions = new HashMap();
        console.log("Initializing ScoutSessions Map...");
        Object.values(Config.Bosses).forEach((boss) => {
            DiscordClient.ScoutSessions.set(boss.name, {
                boss: boss.name,
                currentScouts: new HashMap()
            });
        })
    }

    return DiscordClient.ScoutSessions;
}

module.exports = (DiscordClient) => {
    DiscordClient.getScoutSessions = getScoutSessions
}