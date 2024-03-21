module.exports = {
    GeneralInfo: {
        botName: "SoD Boss Scouter",
        botOwner: "WingTzu",
        version: "0.1",
        serverTimezone: "-0700"
    },
    ServerInfo: {
        id: "1219312419554332673",
        admins: [
            "239194797406027777"
        ],
        channels: {
            alert: {
                id: "1219318233853722634"
            },
            scouting: {
                id: "1219318268628570112"
            },
            loot: {
                id: "1219320056274616321"
            },
            logs: {
                id: "1219320225925697606"
            }
        }
    },
    Guilds: [
        {
            tag: "SCIENCE",
            name: "SCIENCE",
            color: 16777215,
            sayings: [
                "%s is scouting %b."
            ]
        }
    ],
    Sheets: {
        Attendance: {
            name: "Attendance (Test)",
            id: "13eESta2AZV2vlHbRk_s5YbDCoAPycTPjUkUTo_ltCZE",
            separator: "\n",
            headerRows: 3,
            startColumn: 2,
            columnsBeforeBosses: 3,
            columnsAfterBosses: 2
        },
        Calendar: {
            id: "1HNxhS4tJ8VEz6DQ-swnLdGEPYV0GI-byyE_dPzs0bxM",
            separator: "\n",
            datePattern: "m/d"
        },
        BossLogs: {
            name: "Boss Logs (Test)",
            id: ""
        }
    },
    Enums: {
        CommandType: {
            SlashCommand: 1,
            ButtonCommand: 2
        },
        ButtonName: {
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
            LootBackToMainView: "btn-BackToMainView"
        }
    },
    Bosses: {
        Azuregos: {
            name: "Azuregos",
            type: "Blue Dragon"
        },
        Kazzak: {
            name: "Doom Lord Kazzak",
            type: "Demon"
        },
        Lethon: {
            name: "Lethon",
            type: "Green Dragon"
        },
        Taerar: {
            name: "Taerar",
            type: "Green Dragon"
        },
        Ysondre: {
            name: "Ysondre",
            type: "Green Dragon"
        },
        Emriss: {
            name: "Emriss",
            type: "Green Dragon"
        }
    }
}