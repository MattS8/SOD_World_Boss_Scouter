const fs = require('fs');
const HashMap = require('hashmap');
const Config = require('../config.js');
const CommandType = Config.Enums.CommandType

module.exports = (DiscordClient) => {
    DiscordClient.handleCommands = async (commandFolders, path) => {
        console.log(' -- Initializing Discord Commands -- ')

        DiscordClient.Commands = new HashMap();
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                switch (command.commandType) {
                    // Slash Commands
                    case CommandType.SlashCommand:
                        const commandData = command.build();
                        DiscordClient.application.commands.create(commandData, Config.ServerInfo.id);
                        DiscordClient.Commands.set(commandData.name, command);
                        console.log(`\t- Initialized ${folder}/${file} (SlashCommand)`);
                        break;

                    // Button Commands
                    case CommandType.ButtonCommand:
                        if (command.btnNames) {
                            for (btnName of command.btnNames) {
                                DiscordClient.Commands.set(btnName, command)
                            }
                        }
                        DiscordClient.Commands.set(command.btnName, command);
                        console.log(`\t- Initialized ${folder}/${file} (ButtonCommand)`);
                        break;
                    default:
                        console.error(`Unkown command type: ${command.commandType}`)
                }
            }
        }
    };
}