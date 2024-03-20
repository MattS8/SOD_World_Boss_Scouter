const fs = require('fs');
const HashMap = require('hashmap');

module.exports = (DiscordClient) => {
    DiscordClient.handleEvents = async (eventFiles, path) => {
        console.log(" -- Initializing Discord Events --");

        DiscordClient.Events = new HashMap();
        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            DiscordClient.Events.set(event.name, event);
            // event.init(DiscordClient);
            if (event.once) {
                DiscordClient.once(event.name, (...args) => event.execute(...args, DiscordClient));
                console.log(`\tInitialized one-time event: ${event.name}`);
            }
            else {
                DiscordClient.on(event.name, (...args) => event.execute(...args, DiscordClient));
                console.log(`\tInitialized event: ${event.name}`);
            }
        }
    };
}