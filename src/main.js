// Note: Make sure to add proper credentials to your .env!
//      DISCORD_TOKEN = '<token>'
//      GOOGLE_CREDENTIALs = '<credentials>'
require('dotenv').config();

// File System
const fs = require('fs');

// Discord
const {Client, Events, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, SlashCommandBuilder} = require('discord.js');
const DiscordClient = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

// Config & Credentials
const Config = require('./config.json');

// Discord Functions, Events, & Commands
const BotFunctions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const BotEvents = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const BotCommands = fs.readdirSync("./src/commands");

// -- Initialization -- //
function Init()
{
    // Link bot functions to Discordlient object
    for (file of BotFunctions) {
        require(`./functions/${file}`)(DiscordClient);
    }

    // Get commands for bot
    // const commandFolders = fs.readdirSync("./src/commands");
    // DiscordClient.handleCommands(commandFolders, "./src/commands");

    // Login to Discord
    DiscordClient.login(process.env.DISCORD_TOKEN);
    DiscordClient.on(Events.ClientReady, clientInfo => OnClientReady(clientInfo));
}

// -- On Ready -- //
function OnClientReady(clientInfo) 
{
    console.log(`${clientInfo.user.tag} is ready!`);
    DiscordClient.user.setActivity('SPIRIT OF AZUREGOS HAS SPAWNED!!!');

    // Bing
    // const bing = new SlashCommandBuilder()
    //     .setName('bing')
    //     .setDescription('This is a ping command!');
    // console.log(bing);
    // DiscordClient.application.commands.create(bing, Config.ServerInfo.id);

    // Register Commands
    const commandFolders = fs.readdirSync("./src/commands");
    DiscordClient.handleCommands(commandFolders, "./src/commands");
}

// -- On Interaction Create -- //
function OnInteractionCreate(interaction)
{
    if (interaction.commandName==='bing') {
        interaction.reply('Bong!')
    }
}

// Make sure to run Initialization or else the bot won't work!
Init()
