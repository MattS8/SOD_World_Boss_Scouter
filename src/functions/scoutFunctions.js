const fs = require('fs');
const Config = require('../config.js');
const HashMap = require('hashmap');
const Utils = require('../util.js');
const ScoutSessionViews = require('../views/scoutSessionViews.js');
const DiscordClient = require('../main.js').DiscordClient;

function getScoutSessions() {
    // Init ScoutSessions list
    if (!DiscordClient.ScoutSessions) {
        DiscordClient.ScoutSessions = new HashMap();
        Object.values(Config.Scouting).forEach((boss) => {
            DiscordClient.ScoutSessions.set(boss.name, {
                boss: boss.name,
                currentScouts: new HashMap()
            });
        })
    }

    return DiscordClient.ScoutSessions;
}

function getScoutErrorMessages(DiscordClient, bossName) {
    const session = DiscordClient.getScoutSessions().get(bossName);
    if (!session.errorMessages) {
        session.errorMessages = new HashMap();
    }

    return session.errorMessages;
}

function deleteScoutErrorMessage(DiscordClient, userId, bossName) {
    const errorMsg = getScoutErrorMessages(DiscordClient, bossName).get(userId);
    errorMsg?.delete?.().catch(console.error);
    getScoutErrorMessages(DiscordClient, bossName).remove(userId);
}

function updateScoutMainView(DiscordClient, bossName) {
    const session = DiscordClient.getScoutSessions().get(bossName);
    const boss = Utils.getScoutBoss(bossName);
    session.message.edit({
        embeds: [ScoutSessionViews.MainView.getEmbed(boss, session)],
        components: [ScoutSessionViews.MainView.getButtonRow(boss)]
    }).catch(console.error);

}

module.exports = (DiscordClient) => {
    DiscordClient.getScoutSessions = getScoutSessions
    DiscordClient.updateScoutMainView = updateScoutMainView
    DiscordClient.getScoutErrorMessages = getScoutErrorMessages
    DiscordClient.deleteScoutErrorMessage = deleteScoutErrorMessage
}