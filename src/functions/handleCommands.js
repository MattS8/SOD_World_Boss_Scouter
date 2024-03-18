const fs = require('fs');
const Config = require('../config.json');
const HashMap = require('hashmap')

module.exports = (DiscordClient) => {
    DiscordClient.handleCommands = async(commandFolders, path) => {
        console.log(' -- Initializing Discord Commands -- ')

        DiscordClient.Commands = new HashMap();
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                const commandData = command.build();
                DiscordClient.application.commands.create(commandData, Config.ServerInfo.id);
                DiscordClient.Commands.set(file, command);

                console.log(`\t- Initialized ${folder}/${file}`);
            }
        }
    };
}