module.exports = {
    Enums: {
        CommandType: {
            SlashCommand: 1,
            ButtonCommand: 2
        },
        InputName: {
            StartLootSession: "btn-StartLootSession",
            EndLootSession: "btn-EndLootSession",
            SelectLootBoss_Kazzak: "btn-SelectLootBossKazzak",
            SelectLootBoss_Azuregos: "btn-SelectLootBossAzuregos",
            SelectLootBoss_GreenDragons: "btn-SelectLootBossGreenDragons",
            SelectLootBoss_Lethon: "btn-SelectLootBossLethon",
            SelectLootBoss_Emriss: "btn-SelectLootBossEmriss",
            SelectLootBoss_Taerar: "btn-SelectLootBossTaerar",
            SelectLootBoss_Ysondre: "btn-SelectLootBossYsondre",
            CloseLootError: "btn-CloseLootError",
            LootGuildSelectionSelected: "btn-LootGuildSelectionSelected",
            LootGuildSelection: "slct-LootGuild",
            LootGuildAttendance: "btn-LootGuildAttendance",
            TxtGuildAttendance: "txt-GuildAttendance",
            LootBackToMainView: "btn-BackToMainView",
            StartNewLootSession: "btn-StartNewLootSession",
            TxtBossSpottedPartyLead: "txt-BossSpottedPartyLead"
        }
    },
    ScoutingSheet: {
        headerLength: 3,
        totalHoursStartCol: 'F',
        bossHoursStartCol: 'I',
        bossHoursEndCol: 'N',
        totalHoursEndCol: 'O',
        summonersStartCol: 'Q',
        summonersEndCol: 'U'
    }
}