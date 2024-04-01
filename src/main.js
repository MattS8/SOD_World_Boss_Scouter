// Note: Make sure to add proper credentials to your .env!
//      DISCORD_TOKEN = '<token>'
//      GOOGLE_CREDENTIALs = '<credentials>'
//      GOOGLE_API_KEY = '<key>'
//      GOOGLE_CLIENT_ID = <project client id>
//      GOOGLE_PROJECT_ID = <project id>
//      GOOGLE_SECRET = <client secret>
require('dotenv').config();
// File System
const fs = require('fs');
// Discord
const {Client, Events, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, SlashCommandBuilder, ButtonStyle, InteractionType} = require('discord.js');
const DiscordClient = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

// -- Initialization -- //
function Init()
{
    // Link bot functions to DiscordClient object
    const BotFunctions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
    for (file of BotFunctions) {
        require(`./functions/${file}`)(DiscordClient);
    }

    // Link bot events to DiscordClient object
    const BotEvents = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
    DiscordClient.handleEvents(BotEvents, "./src/events");

    // Login to Discord
    DiscordClient.login(process.env.DISCORD_TOKEN);
}

// Make sure to run Initialization or else the bot won't work!
Init()
