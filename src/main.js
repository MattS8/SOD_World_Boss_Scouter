// Note: Make sure to add proper credentials to your .env!
//      DISCORD_TOKEN = '<token>'
//      GOOGLE_CREDENTIALs = '<credentials>'
//      GOOGLE_API_KEY = '<key>'
//      GOOGLE_CLIENT_ID = <project client id>
//      GOOGLE_PROJECT_ID = <project id>
//      GOOGLE_SECRET = <client secret>

require("dotenv").config();
// File System
const fs = require("fs");
const path = require("path");
const process = require("process");
// Discord
const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
  SlashCommandBuilder,
  ButtonStyle,
  InteractionType,
} = require("discord.js");
const DiscordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// -- Load Google Credentials -- //
const GoogleCreds = require("./config").Sheets.Credentials;
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function googleLoadSavedCredentialsIfExist() {
  try {
    await fs.readFile(TOKEN_PATH, (err, content) => {
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function googleSaveCredentials(client) {
  const key = GoogleCreds.installed || GoogleCreds.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFileSync(TOKEN_PATH, payload, () => {});
}

/**
 * Writes out a json file needed for google authentication.
 * NOTE: This file should be IGNORED by git!
 */
function writeCredentialsFile() {
  const payload = JSON.stringify(GoogleCreds);
  fs.writeFileSync(CREDENTIALS_PATH, payload, () => {});
  return CREDENTIALS_PATH;
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function googleAuthorize(callback) {
  fs.readFile(TOKEN_PATH, (err, content) => {
    const credentials = JSON.parse(content);
    let client = google.auth.fromJSON(credentials);

    writeCredentialsFile();

    if (client) {
      callback(client);
    } else {
      fetchAuthentication(callback);
    }
  });
}

async function fetchAuthentication(callback) {
  let client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await googleSaveCredentials(client);
  }
  callback(client);
}

let gAuth = null;

// -- Initialization -- //
function Init(googleAuth) {
  gAuth = googleAuth;
  // Link bot functions to DiscordClient object
  const BotFunctions = fs
    .readdirSync("./src/functions")
    .filter((file) => file.endsWith(".js"));
  for (file of BotFunctions) {
    require(`./functions/${file}`)(DiscordClient);
  }

  // Link bot events to DiscordClient object
  const BotEvents = fs
    .readdirSync("./src/events")
    .filter((file) => file.endsWith(".js"));
  DiscordClient.handleEvents(BotEvents, "./src/events");

  // Login to Discord
  DiscordClient.login(process.env.DISCORD_TOKEN);

  //TEST
  const testUserWing = {
    username: 'WingTzu',
    displayName: '<SCIENCE> Wing',
    id: "12345"
  }
  const testBossScouting1 = {
    Azuregos: 100,
    Kazzak: 400,
    Lethon: 3
  }
  DiscordClient.GoogleSheetFunctions.updateScout(gAuth, testUserWing, 'SCIENCE', testBossScouting1);
}

// Make sure to run Initialization or else the bot won't work!
googleAuthorize(Init);

module.exports = {
    DiscordClient: DiscordClient,
    GoogleAuth: gAuth
}