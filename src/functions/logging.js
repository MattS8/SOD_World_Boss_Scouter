const DiscordClient = require("../main.js").DiscordClient;
const Utils = require("../util.js");
const Config = require("../config.js");

async function logBeginShift(scoutArea, startTime, displayName) {
  const channel = await Utils.getChannelFromId(
    Config.Server.channels.scoutLogs.id
  );
  if (!channel) return;

  channel
    .send(
      `__**SHIFT STARTED**__:\n> **${displayName}** started scouting **${scoutArea}** at <t:${Math.round(startTime / 1000)}:t>!`
    )
    .catch((e) => {});
}

/**
 * Logs the ending of a shift to the log channel as defined in Config.Server.logs.scoutingLogs.
 * @param {string} scoutArea The name of the area scouted
 * @param {number} endTime The date time the scouting ended
 * @param {number} duration The duration scouted. This defaults to seconds unless durationUnits is defined
 * @param {string} displayName The name of whoever scouted
 * @param {string|undefined} durationUnits This changes the units used to describe the duration
 * @returns
 */
async function logEndShift(
  scoutArea,
  endTime,
  duration,
  displayName,
  durationUnits
) {
  const channel = await Utils.getChannelFromId(
    Config.Server.channels.scoutLogs.id
  );
  if (!channel) return;

  channel.send(
    `__**SHIFT ENDED**__:\n> **${displayName}** stopped scouting **${scoutArea}** at <t:${Math.round(endTime / 1000)}:t> (Duration: ${duration} ${
      durationUnits || "seconds"
    })`
  );
}

/**
 * Logs that a boss was spotted.
 * @param {{}} selectedSession The config scouting info for the selected scout area
 * @param {*} spotter The displayName of the person who spotted the boss
 */
async function logBossSpotted(selectedSession, spotter) {
  const channel = await Utils.getChannelFromId(
    Config.Server.channels.scoutLogs.id
  );
  if (!channel) return;

  channel.send(
    `__**BOSS SPOTTEDS**__:\n> **${spotter}** spotted **${
      selectedSession.type == "Green Dragon"
        ? "the Green Dragons"
        : selectedSession.name
    }** at <t:${Math.round(new Date().getTime() / 1000)}:t>!}`
  );
}

module.exports = (DiscordClient) => {
  DiscordClient.Logging = {
    logBeginShift: logBeginShift,
    logEndShift: logEndShift,
    logBossSpotted: logBossSpotted,
  };
};
