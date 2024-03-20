const {Events} = require('discord.js');

function execute(interaction, DiscordClient)
{
    // Find command key based on the type of interaction
    let commandName = interaction.isCommand() 
        ? interaction.commandName
        : interaction.isButton()
            ? interaction.customId
            : null;

    console.log(`${this.name}: Executing interation ${commandName}`)
    const commands = DiscordClient.Commands
    if (commands.has(commandName)) {
        const command = commands.get(commandName)
        command.interact(interaction, DiscordClient)
    }
    else {
        console.error(`No event found for ${commandName}!\n\n${JSON.stringify(commands.keys())}`)
    }
}

module.exports = {
    name: Events.InteractionCreate,
    execute: execute
}
