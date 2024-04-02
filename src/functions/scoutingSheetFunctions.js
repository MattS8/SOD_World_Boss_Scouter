const { google } = require("googleapis");
const Config = require("../config.js");
const AttendanceSheetId = Config.Sheets.Attendance.id;
const Constants = require("../constants.js");
const { User } = require("discord.js");
const DiscordClient = require("../main.js").DiscordClient;
const Utils = require('../util.js');

/**
 * Moves "This Week's Hours" data to the "Last Week's Hours" column for the specified guild.
 * @param {*} auth Athentication to access sheets
 * @param {string} guildTag Name of guild scouting sheet
 * @returns
 */
async function transferThisWeeksStats(auth, guildTag) {
  const funcName = "TransferThisWeeksStats";
  const sheets = google.sheets({ version: "v4", auth: auth });
  const thisWeeksRange = `${guildTag}!A${Constants.ScoutingSheet.headerLength}:B`;
  const sheetResTWH = await sheets.spreadsheets.values.get({
    spreadsheetId: AttendanceSheetId,
    range: thisWeeksRange,
  });
  const thisWeeksRows = sheetResTWH.data.values;

  if (!thisWeeksRows || thisWeeksRows.length === 0) {
    console.warn(`${funcName}: No data found for this week's scouting hours!`);
    return "NO_DATA_FOUND";
  }

  const prevWeeksRange = `${guildTag}!C${Constants.ScoutingSheet.headerLength}:D`;

  const updateResponse = await sheets.spreadsheets.values.update({
    spreadsheetId: AttendanceSheetId,
    range: prevWeeksRange,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: thisWeeksRows,
    },
  });

  if (!updateResponse || updateResponse.status != 200) {
    console.warn(`${funcName}: Update failed! (${updateResponse.status})`);
    return "UPDATE_FAILED";
  }

  const clearResponse = await sheets.spreadsheets.values.clear({
    spreadsheetId: AttendanceSheetId,
    range: thisWeeksRange,
  });

  if (!clearResponse || clearResponse.status != 200) {
    console.warn(`${funcName}: Clear failed! (${updateResponse.status})`);
    return "CLEAR_FAILED";
  }
}

/**
 * Adds a new row to the google scouting sheet for the given guild and populates it with any starting data.
 * @param {*} auth Athentication to access sheets
 * @param {string} guildTag Name of guild scouting sheet
 * @param {string} username Discord username
 * @param {string} displayName Discord display name
 * @param {string} id Discord id
 * @param {*} startingBossHours List of bosses with initial scouting data
 * @returns 
 */
async function addNewScoutMemberRow(
  auth,
  guildTag,
  username,
  displayName,
  id,
  startingBossHours
) {
  const funcName = "AddNewScoutMemberRow";
  const sheets = google.sheets({ version: "v4", auth: auth });

  const hoursRange = `${guildTag}!${Constants.ScoutingSheet.totalHoursStartCol}${Constants.ScoutingSheet.headerLength}:${Constants.ScoutingSheet.totalHoursEndCol}`;
  const hoursRes = await sheets.spreadsheets.values.get({
    spreadsheetId: AttendanceSheetId,
    range: hoursRange,
  });
  let hoursRows = hoursRes.data.values;
  if (!hoursRes || hoursRes.status != 200) {
    console.error(
      `${funcName}: Unable to fetch data for ${guildTag} scouting hours!\n\n${JSON.stringify(
        hoursRes
      )}`
    );
    return "FAILED_FETCH";
  } else if (!hoursRows) {
    hoursRows = [];
  }
  const newRowNumber = hoursRows.length + Constants.ScoutingSheet.headerLength;

  const newRow = [username, displayName, id];
  for (boss of Object.keys(Config.Bosses))
    newRow.push(startingBossHours[boss] || 0);

  // Create SUM cell
  newRow.push(
    `=SUM(${Constants.ScoutingSheet.bossHoursStartCol}${newRowNumber}:${Constants.ScoutingSheet.bossHoursEndCol}${newRowNumber})`
  );

  // Empty Col
  newRow.push("");

  // Summoner Locations
  for (location of Config.SummonLocations) newRow.push("FALSE");

  const newHoursRange = `${guildTag}!${Constants.ScoutingSheet.totalHoursStartCol}${newRowNumber}:${Constants.ScoutingSheet.summonersEndCol}${newRowNumber}`;
  const newHoursRes = await sheets.spreadsheets.values.update({
    spreadsheetId: AttendanceSheetId,
    range: newHoursRange,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [newRow],
    },
  });

  return "SUCCESS";
}

/**
 * Returns all scout data for the given guild's scouting spreadsheet.
 * @param {*} auth Athentication to access sheets
 * @param {string} guildTag Name of guild scouting sheet
 * @returns 
 */
async function getAllScoutData(auth, guildTag) {
  const funcName = "GetAllScoutData";
  const sheets = google.sheets({ version: "v4", auth: auth });

  const hoursRange = `${guildTag}!${Constants.ScoutingSheet.totalHoursStartCol}${Constants.ScoutingSheet.headerLength}:${Constants.ScoutingSheet.totalHoursEndCol}`;
  const hoursRes = await sheets.spreadsheets.values.get({
    spreadsheetId: AttendanceSheetId,
    range: hoursRange,
  });
  let hoursRows = hoursRes.data.values;
  if (!hoursRes || hoursRes.status != 200) {
    console.error(
      `${funcName}: Unable to fetch data for ${guildTag} scouting hours!\n\n${JSON.stringify(
        hoursRes
      )}`
    );
    return undefined;
  } else if (!hoursRows) {
    hoursRows = [];
  }

  return hoursRows;
}

/**
 * Returns the header values for the scouting sheet based on the given guildTag.
 * @param {*} auth Athentication to access sheets
 * @param {string} guildTag Name of guild scouting sheet
 * @returns 
 */
async function getHeaderRow(auth, guildTag) {
    const funcName = "GetHeaderRow";
    const sheets = google.sheets({ version: "v4", auth: auth });
    const headerRowNum = Constants.ScoutingSheet.headerLength-2;
    const headerRange = `${guildTag}!${Constants.ScoutingSheet.totalHoursStartCol}${headerRowNum}:${Constants.ScoutingSheet.totalHoursEndCol}${headerRowNum}`;

    const result = await sheets.spreadsheets.values.get({ spreadsheetId: AttendanceSheetId, range: headerRange});

    // Need to edit the result because merged cells suck
    result.data.values[0][0] = "Discord Username";
    result.data.values[0][1] = "Discord Display Name";
    result.data.values[0][2] = "Discord ID";

    if (!result || result.status != 200) {
      console.error(`${funcName}: Unable to fetch header row...`);
      return [];
    }

    return result.data.values[0];

}

/**
 * 
 * @param {*} auth Athentication to access sheets
 * @param {User} user Discord user object
 * @param {string} guildTag Name of guild scouting sheet
 * @param {[]} addedBossTimes List of bosses and the amount of time to add to scouting data
 */
async function updateScout(auth, user, guildTag, addedBossTimes) {
  const funcName = "UpdateScout";
  const sheets = google.sheets({ version: "v4", auth: auth });

  // Find existing scout data
  const allScoutData = await getAllScoutData(auth, guildTag);
  let scoutIndex = 0;
  let scoutData = allScoutData.filter((data, index) => {
    if (data[2] === user.id) {
      scoutIndex = index;
      return true;
    } else {
      return false;
    }
  });
  if (!scoutData || scoutData.length === 0) {
    // Add a new scout entry
    addNewScoutMemberRow(
      auth,
      guildTag,
      user.username,
      user.displayName,
      user.id,
      addedBossTimes
    );
  } else {
    // Update existing scout
    const headerRow = await getHeaderRow(auth, guildTag);
    
    // Convert to a map object using the header values so that we can dynamically add any boss values
    let scoutObj = Utils.convertSheetDataToScoutData(scoutData[0], headerRow)
    for (boss of Object.keys(Config.Bosses)) {
      scoutObj[`${boss} Time (hours)`] = Number(scoutObj[`${boss} Time (hours)`]) + Number(addedBossTimes[boss] || 0);
    }

    // Find the row of the existing scout
    const changedRow = scoutIndex + Constants.ScoutingSheet.headerLength;

    // Change the 'Total' cell back to the sum equation
    scoutObj['Total'] = `=SUM(${Constants.ScoutingSheet.bossHoursStartCol}${changedRow}:${Constants.ScoutingSheet.bossHoursEndCol}${changedRow})`

    // Update the sheet
    const hoursRange = `${guildTag}!${Constants.ScoutingSheet.totalHoursStartCol}${changedRow}:${Constants.ScoutingSheet.totalHoursEndCol}${changedRow}`;
    const hoursRes = await sheets.spreadsheets.values.update({
      spreadsheetId: AttendanceSheetId,
      range: hoursRange,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [Utils.convertScoutObjToSheetData(scoutObj, headerRow)],
      },
    });

    // Catch any errors
    if (!hoursRes || hoursRes.status != 200) {
      console.error(`${funcName}: Unable to update range for ${user.displayName || 'NULL DISPLAYNAME'}!`)
    }
  }
}

module.exports = (DiscordClient) => {
  DiscordClient.GoogleSheetFunctions = {
    transferThisWeeksStats: transferThisWeeksStats,
    addNewScoutMemberRow: addNewScoutMemberRow,
    getAllScoutData: getAllScoutData,
    updateScout: updateScout,
  };
};
