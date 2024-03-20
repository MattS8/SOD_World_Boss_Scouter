const { SlashCommandBuilder } = require('discord.js')
const CommandType = require('../../config.js').Enums.CommandType

function interact(interaction, DiscordClient) 
{
    interaction.reply('Bong!')
}

function build()
{
    return new SlashCommandBuilder()
        .setName('bing')
        .setDescription("This is a ping command.");
}

module.exports = {
    build: build,
    interact: interact,
    commandType: CommandType.SlashCommand
}