const { google } = require('googleapis')
const Config = require('../config.js')
const AttendanceSheetId = Config.Sheets.Attendance.id
const Constants = require('../constants.js')
const { User } = require('discord.js')
const GoogleAuth = require('../main.js').GetGoogleAuth
const Utils = require('../util.js')
const TotalHoursIndex = Object.keys(Config.Scouting).length + 3

/**
 * Moves "This Week's Hours" data to the "Last Week's Hours" column for the specified guild.
 * @param {string} guildTag Name of guild scouting sheet
 * @returns
 */
async function transferThisWeeksStats (guildTag) {
  const funcName = 'TransferThisWeeksStats'
  const sheets = google.sheets({ version: 'v4', auth: auth })
  const thisWeeksRange = `${guildTag}!A${Constants.ScoutingSheet.headerLength}:B`
  const sheetResTWH = await sheets.spreadsheets.values.get({
    spreadsheetId: AttendanceSheetId,
    range: thisWeeksRange
  })
  const thisWeeksRows = sheetResTWH.data.values

  if (!thisWeeksRows || thisWeeksRows.length === 0) {
    console.warn(`${funcName}: No data found for this week's scouting hours!`)
    return 'NO_DATA_FOUND'
  }

  const prevWeeksRange = `${guildTag}!C${Constants.ScoutingSheet.headerLength}:D`

  const updateResponse = await sheets.spreadsheets.values.update({
    spreadsheetId: AttendanceSheetId,
    range: prevWeeksRange,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: thisWeeksRows
    }
  })

  if (!updateResponse || updateResponse.status != 200) {
    console.warn(`${funcName}: Update failed! (${updateResponse.status})`)
    return 'UPDATE_FAILED'
  }

  const clearResponse = await sheets.spreadsheets.values.clear({
    spreadsheetId: AttendanceSheetId,
    range: thisWeeksRange
  })

  if (!clearResponse || clearResponse.status != 200) {
    console.warn(`${funcName}: Clear failed! (${updateResponse.status})`)
    return 'CLEAR_FAILED'
  }
}

function addBossTimesToRow (scoutObj, headerRow, addedBossTimes) {
  for (key of Object.keys(Config.Scouting)) {
    const scoutArea = Config.Scouting[key]
    scoutObj[scoutArea.name] = (
      Number(scoutObj[scoutArea.name]) +
      Number(addedBossTimes[scoutArea.name] || 0) / (60 * 60)
    ).toFixed(4)
  }

  return Utils.convertScoutObjToSheetData(scoutObj, headerRow)
}

/**
 * Adds a new row to the google scouting sheet for the given guild and populates it with any starting data.
 * @param {string} guildTag Name of guild scouting sheet
 * @param {string} username Discord username
 * @param {string} displayName Discord display name
 * @param {string} id Discord id
 * @param {{}} startingBossHours List of bosses with initial scouting data
 * @returns
 */
async function addNewScoutMemberRow (
  guildTag,
  username,
  displayName,
  id,
  startingBossHours
) {
  const auth = GoogleAuth()
  const funcName = 'AddNewScoutMemberRow'
  const sheets = google.sheets({ version: 'v4', auth: auth })
  const headerRow = await getHeaderRow(guildTag)

  const hoursRange = `${guildTag}!${Constants.ScoutingSheet.totalHoursStartCol}${Constants.ScoutingSheet.headerLength}:${Constants.ScoutingSheet.totalHoursEndCol}`
  const hoursRes = await sheets.spreadsheets.values.get({
    spreadsheetId: AttendanceSheetId,
    range: hoursRange
  })
  let hoursRows = hoursRes.data.values
  if (!hoursRes || hoursRes.status != 200) {
    console.error(
      `${funcName}: Unable to fetch data for ${guildTag} scouting hours!\n\n${JSON.stringify(
        hoursRes
      )}`
    )
    return 'FAILED_FETCH'
  } else if (!hoursRows) {
    hoursRows = []
  }
  const newRowNumber = hoursRows.length + Constants.ScoutingSheet.headerLength
  const newRow = addBossTimesToRow(
    Utils.convertSheetDataToScoutData([username, displayName, id], headerRow),
    headerRow,
    startingBossHours
  )

  // Create SUM cell
  newRow[
    TotalHoursIndex
  ] = `=SUM(${Constants.ScoutingSheet.bossHoursStartCol}${newRowNumber}:${Constants.ScoutingSheet.bossHoursEndCol}${newRowNumber})`

  // Empty space
  newRow.push('')

  // Summoner Locations
  for (location of Config.SummonLocations) newRow.push('FALSE')

  const newHoursRange = `${guildTag}!${Constants.ScoutingSheet.totalHoursStartCol}${newRowNumber}:${Constants.ScoutingSheet.summonersEndCol}${newRowNumber}`
  const newHoursRes = await sheets.spreadsheets.values.update({
    spreadsheetId: AttendanceSheetId,
    range: newHoursRange,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [newRow]
    }
  })

  return 'SUCCESS'
}

/**
 * Returns all scout data for the given guild's scouting spreadsheet.
 * @param {string} guildTag Name of guild scouting sheet
 * @returns
 */
async function getAllScoutData (guildTag) {
  const auth = GoogleAuth()
  const funcName = 'GetAllScoutData'
  const sheets = google.sheets({ version: 'v4', auth: auth })

  const hoursRange = `${guildTag}!${Constants.ScoutingSheet.totalHoursStartCol}${Constants.ScoutingSheet.headerLength}:${Constants.ScoutingSheet.totalHoursEndCol}`
  const hoursRes = await sheets.spreadsheets.values.get({
    spreadsheetId: AttendanceSheetId,
    range: hoursRange
  })
  let hoursRows = hoursRes.data.values
  if (!hoursRes || hoursRes.status != 200) {
    console.error(
      `${funcName}: Unable to fetch data for ${guildTag} scouting hours!\n\n${JSON.stringify(
        hoursRes
      )}`
    )
    return undefined
  } else if (!hoursRows) {
    hoursRows = []
  }

  return hoursRows
}

/**
 * Returns the header values for the scouting sheet based on the given guildTag.
 * @param {string} guildTag Name of guild scouting sheet
 * @returns
 */
async function getHeaderRow (guildTag) {
  const auth = GoogleAuth()
  const funcName = 'GetHeaderRow'
  const sheets = google.sheets({ version: 'v4', auth: auth })
  const headerRowNum = Constants.ScoutingSheet.headerLength - 2
  const headerRange = `${guildTag}!${Constants.ScoutingSheet.totalHoursStartCol}${headerRowNum}:${Constants.ScoutingSheet.totalHoursEndCol}${headerRowNum}`

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: AttendanceSheetId,
    range: headerRange
  })

  // Need to edit the result because merged cells suck
  result.data.values[0][0] = 'Discord Username'
  result.data.values[0][1] = 'Discord Display Name'
  result.data.values[0][2] = 'Discord ID'

  if (!result || result.status != 200) {
    console.error(`${funcName}: Unable to fetch header row...`)
    return []
  }

  return result.data.values[0]
}

/**
 * @param {User} user Discord user object
 * @param {*} memberName The name with the guild tag in front
 * @param {string} guildTag Name of guild scouting sheet
 * @param {{}} addedBossTimes List of bosses and the amount of time to add to scouting data
 */
async function updateScout (user, memberName, guildTag, addedBossTimes) {
  const auth = GoogleAuth()
  const funcName = 'UpdateScout'
  const sheets = google.sheets({ version: 'v4', auth: auth })

  // Find existing scout data
  const allScoutData = await getAllScoutData(guildTag)
  let scoutIndex = 0
  let scoutData = allScoutData.filter((data, index) => {
    if (data[2] === user.id) {
      scoutIndex = index
      return true
    } else {
      return false
    }
  })
  if (!scoutData || scoutData.length === 0) {
    // Add a new scout entry
    addNewScoutMemberRow(
      guildTag,
      user.username,
      memberName,
      user.id,
      addedBossTimes
    )
  } else {
    // Update existing scout
    const headerRow = await getHeaderRow(guildTag)

    // Convert to a map object using the header values so that we can dynamically add any boss values
    let scoutObj = Utils.convertSheetDataToScoutData(scoutData[0], headerRow)
    scoutObj = addBossTimesToRow(scoutObj, headerRow, addedBossTimes)

    // Find the row of the existing scout
    const changedRow = scoutIndex + Constants.ScoutingSheet.headerLength

    // Change the 'Total' cell back to the sum equation
    scoutObj[
      TotalHoursIndex
    ] = `=SUM(${Constants.ScoutingSheet.bossHoursStartCol}${changedRow}:${Constants.ScoutingSheet.bossHoursEndCol}${changedRow})`

    // Update the sheet
    const hoursRange = `${guildTag}!${Constants.ScoutingSheet.totalHoursStartCol}${changedRow}:${Constants.ScoutingSheet.totalHoursEndCol}${changedRow}`
    const hoursRes = await sheets.spreadsheets.values.update({
      spreadsheetId: AttendanceSheetId,
      range: hoursRange,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [scoutObj]
      }
    })

    // Catch any errors
    if (!hoursRes || hoursRes.status != 200) {
      console.error(
        `${funcName}: Unable to update range for ${
          user.displayName || 'NULL DISPLAYNAME'
        }!`
      )
    }
  }
}

module.exports = DiscordClient => {
  DiscordClient.GoogleSheetFunctions = {
    Scouting: {
      transferThisWeeksStats: transferThisWeeksStats,
      addNewScoutMemberRow: addNewScoutMemberRow,
      getAllScoutData: getAllScoutData,
      updateScout: updateScout
    }
  }
}
