const HashMap = require('hashmap');
const Config = require('../../config.js')
const CommandType = Config.Enums.CommandType
const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, messageLink } = require('discord.js');
const ButtonName = Config.Enums.ButtonName

// -- Embed Messages -- //
const greenDragonEmbed = new EmbedBuilder()
    .setColor(0xA2810D)
    .setTitle('Select Green Dragon')
    .setDescription('Which green dragon is this loot is from?')
    .setTimestamp();

// -- Button Rows -- //
const dragonSelectRow = new ActionRowBuilder()
    .addComponents(
        // Start
        new ButtonBuilder()
            .setCustomId(ButtonName.SelectLootBoss_Emriss)
            .setLabel(Config.Bosses.Emriss.name)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(ButtonName.SelectLootBoss_Lethon)
            .setLabel(Config.Bosses.Lethon.name)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(ButtonName.SelectLootBoss_Taerar)
            .setLabel(Config.Bosses.Taerar.name)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(ButtonName.SelectLootBoss_Ysondre)
            .setLabel(Config.Bosses.Ysondre.name)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(ButtonName.EndLootSession)
            .setLabel('Close')
            .setStyle(ButtonStyle.Danger)
    );

// -- Exports -- //
function interact(interaction, DiscordClient) {
    const session = DiscordClient.LootSessions.get(interaction.user.id);

    if (!session) {
        console.error(`Unable to find session under user ${interaction.user.id}!`);
        return
    }

    try {
        interaction.reply({ content: " ", fetchReply: false }).catch(console.error)
    } catch (e) { }

    switch (interaction.customId) {
        case ButtonName.SelectLootBoss_Azuregos:
            session.Boss = Config.Bosses.Azuregos.name;
            console.log(`Boss set to ${session.Boss}`);
            break;
        case ButtonName.SelectLootBoss_GreenDragons:
            console.log(`Determining which green dragon...`);
            session.message?.edit?.({
                embeds: [greenDragonEmbed],
                components: [dragonSelectRow],
                ephemeral: true
            }).catch(console.error);
            break;
        case ButtonName.SelectLootBoss_Kazzak:
            session.Boss = Config.Bosses.Kazzak.name;
            console.log(`Boss set to ${session.Boss}`);
            break;
        case ButtonName.SelectLootBoss_Emriss:
            session.Boss = Config.Bosses.Emriss.name;
            console.log(`Boss set to ${session.Boss}`);
            break;
        case ButtonName.SelectLootBoss_Taerar:
            session.Boss = Config.Bosses.Taerar.name;
            console.log(`Boss set to ${session.Boss}`);
            break;
        case ButtonName.SelectLootBoss_Lethon:
            session.Boss = Config.Bosses.Lethon.name;
            console.log(`Boss set to ${session.Boss}`);
            break;
        case ButtonName.SelectLootBoss_Ysondre:
            session.Boss = Config.Bosses.Ysondre.name;
            console.log(`Boss set to ${session.Boss}`);
            break;
        default:
            console.error(`Unable to find loot action for bust with customId ${interaction.customId}`);
    }
}

module.exports = {
    btnNames: [ButtonName.SelectLootBoss_Azuregos, ButtonName.SelectLootBoss_GreenDragons, ButtonName.SelectLootBoss_Kazzak],
    interact: interact,
    commandType: CommandType.ButtonCommand
}