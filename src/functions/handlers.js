const HashMap = require('hashmap')
const TimedMessages = new HashMap()
const fs = require('fs')
const Config = require('../config.js')
const { Message } = require('discord.js')
const CommandType = require('../constants.js').Enums.CommandType
const DiscordClient = require('../main.js').DiscordClient

/**
 * Initializes all command files by using a predefined structure for each command.
 * Each command file will contain a CommandType, InputName(s), and an 'interact' function.
 * @param {[string]} commandFolders A list of folders containing command files
 * @param {string} path The path to get to the folders
 */
async function handleCommands (commandFolders, path) {
  console.log(' -- Initializing Discord Commands -- ')

  DiscordClient.Commands = new HashMap()
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`${path}/${folder}`)
      .filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
      const command = require(`../commands/${folder}/${file}`)
      switch (command.commandType) {
        // Slash Commands
        case CommandType.SlashCommand:
          const commandData = command.build()
          DiscordClient.application.commands.create(
            commandData,
            Config.Server.id
          )
          DiscordClient.Commands.set(commandData.name, command)
          console.log(`\t- Initialized ${folder}/${file} (SlashCommand)`)
          break

        // Button Commands
        case CommandType.ButtonCommand:
          if (command.inputNames) {
            for (inputName of command.inputNames) {
              DiscordClient.Commands.set(inputName, command)
            }
          }
          DiscordClient.Commands.set(command.inputName, command)
          console.log(`\t- Initialized ${folder}/${file} (ButtonCommand)`)
          break
        default:
          console.error(
            `ERROR (${
              command.inputName ||
              `${command.inputNames[0]} +${
                command.inputNames.length - 1
              } others...`
            }): Unkown command type: ${command.commandType}`
          )
      }
    }
  }
}

/**
 * Intializes all events by usinga predefined structure for each event.
 * Each event file will contain a unique 'name' and and 'execute' function
 * @param {[string]} eventFiles List of event files
 * @param {string} path The path to get to the event folders
 */
async function handleEvents (eventFiles, path) {
  console.log(' -- Initializing Discord Events --')

  DiscordClient.Events = new HashMap()
  for (const file of eventFiles) {
    const event = require(`../events/${file}`)
    DiscordClient.Events.set(event.name, event)
    // event.init(DiscordClient);
    if (event.once) {
      DiscordClient.once(event.name, (...args) => event.execute(...args))
      console.log(`\t- Initialized one-time event: ${event.name}`)
    } else {
      DiscordClient.on(event.name, (...args) => event.execute(...args))
      console.log(`\t- Initialized event: ${event.name}`)
    }
  }
}

/**
 * Helper Function: Deletes a message from the TimedMessages group.
 * @param {string} id Message id
 */
function deleteMessage (id) {
  const expiredMessage = TimedMessages.get(id)
  try {
    expiredMessage?.callback?.()
    expiredMessage.message.delete().catch(console.error)
  } catch (error) {}
}

/**
 * Keeps track of a message for deletion after 'duration' (ms).
 * @param {string} id Message id
 * @param {Message} message A discord message to be deleted after given duration
 * @param {*} duration Time (ms) until message is deleted
 * @param {() => {}} callback A callback called right before message is deleted
 */
async function handleTimedMessage (id, message, duration, callback = null) {
  // Check for duplicates
  if (TimedMessages.has(id)) {
    console.warn(
      `A timed message with the id ${id} was already found! Deleting old message first...`
    )
    deleteMessage(id)
  }

  TimedMessages.set(id, {
    message: message,
    duration: duration,
    callback: callback
  })

  setTimeout(deleteMessage, duration, id)
}

module.exports = DiscordClient => {
  ;(DiscordClient.handleCommands = handleCommands),
    (DiscordClient.handleEvents = handleEvents),
    (DiscordClient.handleTimedMessage = handleTimedMessage)
}
