const fs = require('fs');
const Config = require('./config.js');
const Guilds = Config.Guilds;


module.exports = {
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  getGuild: (userId, DiscordClient) => {
    const guild = DiscordClient.guilds.cache.get(Config.Server.id);
    if (guild) {
      guild.members.fetch(userId)
        .then(member => {
          try {
            const displayName = member ? member.displayName : "_none_";
            const guildName = displayName.substring(1, displayName.indexOf('>')).toLowerCase()
            for (const guild of Guilds) {
              if (guild.name.toLowerCase() === guildName)
                return guild
            }

            console.error(`Unable to find guild for ${userId}!`);
            return Guilds[0];
          } catch (error) {
            console.error(`ERROR: Unable to get guild from ${userId}!\n\n${error}`);
          }
        })
        .catch(console.error);
    } else {
      console.error(`Unable to find guild for ${userId}!`);
      return Guilds[0];
    }
  }
}