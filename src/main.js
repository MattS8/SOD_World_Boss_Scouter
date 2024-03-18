// Note: Make sure to add proper credentials to your .env!
//      DISCORD_TOKEN = '<token>'
//      GOOGLE_CREDENTIALs = '<credentials>'
require('dotenv').config();

// Discord
const {Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions} = require('discord.js')
const DiscordClient = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]})

// Config & Credentials
const Config = require('./config.json')

function OnClientReady(clientInfo) 
{
    console.log(`${clientInfo.user.tag} is ready!`)
    DiscordClient.user.setActivity('SPIRIT OF AZUREGOS HAS SPAWNED!!!')
}

DiscordClient.on("ready", OnClientReady)
DiscordClient.login(process.env.DISCORD_TOKEN)