const Config = require('../../config.js');
const CommandType = Config.Enums.CommandType;
const InputName = Config.Enums.InputName;
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
        case InputName.SelectLootBoss_Azuregos:
            session.boss = Config.Bosses.Azuregos.name;
            console.log(`Boss set to ${session.boss}`);
            session.message?.edit?.({
                embeds: [LootSessionViews.MainView.embed(session)],
                components: [LootSessionViews.MainView.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        case InputName.SelectLootBoss_GreenDragons:
            console.log(`Determining which green dragon...`);
            session.message?.edit?.({
                embeds: [LootSessionViews.GreenDragonSelection.embed],
                components: [LootSessionViews.GreenDragonSelection.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        case InputName.SelectLootBoss_Kazzak:
            session.boss = Config.Bosses.Kazzak.name;
            console.log(`Boss set to ${session.boss}`);
            session.message?.edit?.({
                embeds: [LootSessionViews.MainView.embed(session)],
                components: [LootSessionViews.MainView.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        case InputName.SelectLootBoss_Emriss:
            session.boss = Config.Bosses.Emriss.name;
            console.log(`Boss set to ${session.boss}`);
            session.message?.edit?.({
                embeds: [LootSessionViews.MainView.embed(session)],
                components: [LootSessionViews.MainView.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        case InputName.SelectLootBoss_Taerar:
            session.boss = Config.Bosses.Taerar.name;
            console.log(`Boss set to ${session.boss}`);
            session.message?.edit?.({
                embeds: [LootSessionViews.MainView.embed(session)],
                components: [LootSessionViews.MainView.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        case InputName.SelectLootBoss_Lethon:
            session.boss = Config.Bosses.Lethon.name;
            console.log(`Boss set to ${session.boss}`);
            session.message?.edit?.({
                embeds: [LootSessionViews.MainView.embed(session)],
                components: [LootSessionViews.MainView.buttonRow],
                ephemeral: true
            }).catch(console.error);
            break;
        case InputName.SelectLootBoss_Ysondre:
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
    btnNames: [InputName.SelectLootBoss_Azuregos, InputName.SelectLootBoss_GreenDragons, InputName.SelectLootBoss_Kazzak,
    InputName.SelectLootBoss_Emriss, InputName.SelectLootBoss_Lethon, InputName.SelectLootBoss_Taerar, InputName.SelectLootBoss_Ysondre],
    interact: interact,
    commandType: CommandType.ButtonCommand
}