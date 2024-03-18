const fs = require('fs');

module.exports = (DiscordClient) => {
    DiscordClient.handleEvents = async (eventFiles, path) => {
        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            if (event.once) {
                DiscordClient.once(event.name, (...args) => event.execute(...args, DiscordClient));
            }
            else {
                DiscordClient.on(event.name, (...args) => event.execut(...args, DiscordClient));
            }
        }
    };
}