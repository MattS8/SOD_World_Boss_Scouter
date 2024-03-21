const Config = require('../../config.js');
const CommandType = Config.Enums.CommandType;
const ButtonName = Config.Enums.ButtonName;
const LootSessionViews = require('../../views/lootSessionViews.js');

// -- Exports -- //
function interact(interaction, DiscordClient) {
    const session = DiscordClient.LootSessions.get(interaction.user.id);
    if (!session) {
        console.error(`Unable to find session under user ${interaction.user.id}!`);
        return
    }

    // This is a hacky workaround because I can't seem to figure out how to properly
    // stop buttons from reporting that their "interaction failed" without sending 
    // a dummy reply.
    try {
        interaction.reply({ content: " ", fetchReply: false }).catch(console.error)
    } catch (e) { }

    switch (interaction.customId) {
        case ButtonName.SelectLootBoss_Azuregos:
            session.boss = Config.Bosses.Azuregos.name;
            console.log(`Boss set to ${session.boss}`);
            session.message?.edit?.({
                embeds: [LootSessionViews.MainView.embed(session)],
                components: [LootSessionViews.MainView.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        case ButtonName.SelectLootBoss_GreenDragons:
            console.log(`Determining which green dragon...`);
            session.message?.edit?.({
                embeds: [LootSessionViews.GreenDragonSelection.embed],
                components: [LootSessionViews.GreenDragonSelection.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        case ButtonName.SelectLootBoss_Kazzak:
            session.boss = Config.Bosses.Kazzak.name;
            console.log(`Boss set to ${session.boss}`);
            session.message?.edit?.({
                embeds: [LootSessionViews.MainView.embed(session)],
                components: [LootSessionViews.MainView.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        case ButtonName.SelectLootBoss_Emriss:
            session.boss = Config.Bosses.Emriss.name;
            console.log(`Boss set to ${session.boss}`);
            session.message?.edit?.({
                embeds: [LootSessionViews.MainView.embed(session)],
                components: [LootSessionViews.MainView.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        case ButtonName.SelectLootBoss_Taerar:
            session.boss = Config.Bosses.Taerar.name;
            console.log(`Boss set to ${session.boss}`);
            session.message?.edit?.({
                embeds: [LootSessionViews.MainView.embed(session)],
                components: [LootSessionViews.MainView.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        case ButtonName.SelectLootBoss_Lethon:
            session.boss = Config.Bosses.Lethon.name;
            console.log(`Boss set to ${session.boss}`);
            session.message?.edit?.({
                embeds: [LootSessionViews.MainView.embed(session)],
                components: [LootSessionViews.MainView.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        case ButtonName.SelectLootBoss_Ysondre:
            session.boss = Config.Bosses.Ysondre.name;
            console.log(`Boss set to ${session.boss}`);
            session.message?.edit?.({
                embeds: [LootSessionViews.MainView.embed(session)],
                components: [LootSessionViews.MainView.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        default:
            console.error(`Unable to find loot action with customId ${interaction.customId}`);
    }
}

module.exports = {
    btnNames: [ButtonName.SelectLootBoss_Azuregos, ButtonName.SelectLootBoss_GreenDragons, ButtonName.SelectLootBoss_Kazzak,
    ButtonName.SelectLootBoss_Emriss, ButtonName.SelectLootBoss_Lethon, ButtonName.SelectLootBoss_Taerar, ButtonName.SelectLootBoss_Ysondre],
    interact: interact,
    commandType: CommandType.ButtonCommand
}