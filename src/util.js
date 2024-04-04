const fs = require('fs')
const Config = require('./config.js')
const Guilds = Config.Guilds
const DiscordClient = require('./main.js').DiscordClient

module.exports = {
  sleep: ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  getGuild: (userId, DiscordClient, callback) => {
    const discordGuild = DiscordClient.guilds.cache.get(Config.Server.id)
    if (discordGuild) {
      discordGuild.members
        .fetch(userId)
        .then(member => {
          try {
            const displayName = member ? member.displayName : '_none_'
            const guildName = displayName
              .substring(1, displayName.indexOf('>'))
              .toLowerCase()
            for (const guild of Guilds) {
              if (guild.name.toLowerCase() === guildName) {
                callback(guild)
                return
              }
            }

            console.error(`Unable to find guild for ${userId}!`)
          } catch (error) {
            console.error(
              `ERROR: Unable to get guild from ${userId}!\n\n${error}`
            )
          }
        })
        .catch(console.error)
    } else {
      console.error(`Unable to find guild for ${userId}!`)
    }
  },

  getBoss: bossName => {
    const bossList = Object.values(Config.Bosses).filter(
      boss => boss.name === bossName
    )
    if (bossList.length == 1) {
      return bossList[0]
    } else if (bossList.length == 0) {
      console.error(`ERROR: Unable to get boss with name: '${bossName}'!`)
      return Object.values(Config.Bosses)[0]
    } else {
      console.warn(
        `WARNING: Found multiple instances of boss with name: '${bossName}'!`
      )
      return bossList[0]
    }
  },

  getScoutBoss: scoutBossName => {
    const bossList = Object.values(Config.Scouting).filter(
      boss => boss.name === scoutBossName
    )
    if (bossList.length == 1) {
      return bossList[0]
    } else if (bossList.length == 0) {
      console.error(
        `ERROR: Unable to get scout boss with name: '${scoutBossName}'!`
      )
      return Object.values(Config.Scouting)[0]
    } else {
      console.warn(
        `WARNING: Found multiple instances of scout boss with name: '${scoutBossName}'!`
      )
      return bossList[0]
    }
  },

  convertSheetDataToScoutData: (sheetData, headerRow) => {
    const scoutData = {}
    let index = 0
    for (header of headerRow) {
      scoutData[header] = sheetData[index] || ''
      ++index
    }

    return scoutData
  },

  convertScoutObjToSheetData: (scoutObj, headerRow) => {
    let sheetRow = []

    for (header of headerRow) {
      sheetRow.push(scoutObj[header])
    }

    return sheetRow
  },

  getChannelFromId: async channelId => {
    try {
      const channel = await DiscordClient.channels.fetch(channelId)
      return channel
    } catch (err) {
      {
        console.error('Error fetching channel: ', err)
        return null
      }
    }
  }
}
