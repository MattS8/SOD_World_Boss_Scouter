const Config = require("../../config.js");
const DiscordClient = require("../../main.js").DiscordClient;
const Utils = require("../../util.js");
const ScoutSessionViews = require("../../views/scoutSessionViews.js");
const CommandType = require("../../constants.js").Enums.CommandType;
const Inputnames = [];
const ModalIdentifier = "_modal";
// Initialize input names for modals and for button presses
for (key of Object.keys(Config.Scouting)) {
  Inputnames.push(Config.Scouting[key].btnNames.bossSpotted);
  Inputnames.push(
    `${Config.Scouting[key].btnNames.bossSpotted}${ModalIdentifier}`
  );
}

async function sendBossAlert(interaction, selectedSession, session) {
  const channel = await Utils.getChannelFromId(Config.Server.channels.alert.id);
  if (!channel) return;

  channel
    .send({
      embeds: [
        ScoutSessionViews.BossSpotted.getEmbed(
          selectedSession,
          session.partyLeader
        ),
      ],
    })
    .then(() => {interaction?.deferUpdate();})
    .catch((error) => console.error(`Failed to send boss alert:\n${error}`));
}

async function showModal(interaction, selectedSession) {
  interaction
    .showModal(
      ScoutSessionViews.BossSpotted.modal(
        selectedSession,
        `${interaction.customId}${ModalIdentifier}`
      )
    )
    .catch((error) =>
      console.error(`Failed to show BossSpotted modal!\n${error}`)
    );
}

async function interact(interaction) {
  if (Inputnames.includes(interaction.customId)) {
    const ScoutSessions = DiscordClient.getScoutSessions();
    if (interaction.customId.includes(ModalIdentifier)) {
        if (!interaction.components[0]?.components[0]?.value) {
            console.error("Party leader input error!");
            return;
        }

      const fltr = (s) =>
        `${s.btnNames.bossSpotted}${ModalIdentifier}` === interaction.customId;
      const selectedSession = Object.values(Config.Scouting).filter(fltr)[0];
      const session = ScoutSessions.get(selectedSession.name);
      session.partyLeader = interaction.components[0].components[0].value;
      if (!session.IsUp) {
        sendBossAlert(interaction, selectedSession, session);
        DiscordClient.Logging.logBossSpotted(selectedSession, interaction.member.displayName);
        session.IsUp = true
        console.log("TODO: Set timer to check if boss has been marked as killed. If not, send a reminder to the person who spotted to mark as killed.");
      }
      else
        console.warn(
          `Warning: Attempted to trigger boss spotted for ${selectedSession.name}, however it was previously triggered.`
        );
    } else {
      const fltr = (s) => s.btnNames.bossSpotted === interaction.customId;
      const selectedSession = Object.values(Config.Scouting).filter(fltr)[0];
      showModal(interaction, selectedSession);
    }
  } else {
    console.warn(
      `Unable to find bossSpotted action with id ${interaction.customId}!`
    );
  }
}

module.exports = {
  inputNames: Inputnames,
  interact: interact,
  commandType: CommandType.ButtonCommand,
};
