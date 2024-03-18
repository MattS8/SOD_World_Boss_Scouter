const { SlashCommandBuilder } = require('discord.js')

function interact(interaction) 
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
    interact: interact
}