module.exports = {
    General: {
        botName: "SoD Boss Scouter",
        botOwner: "WingTzu",
        version: "0.1",
        serverTimezone: "-0700",
        dateFormats: {
            default: {
                "weekday": "long",
                "month": "2-digit",
                "day": "2-digit",
                "hour": "numeric",
                "minute": "2-digit",
                "timeZone": "America/Los_Angeles"
              }
        },
        errorColor: 0xC12115
    },
    Server: {
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
        },
        {
            tag: "Fury",
            name: "Fury",
            color: 16779215,
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
            ScoutBeginShift: "btn-ScoutBeginShift",
        }
    },
    Bosses: {
        Azuregos: {
            name: "Azuregos",
            type: "Blue Dragon",
            color: 0x0E44CE,
            channels: {
                scouting: '1220945685424115782',
            },
            btnNames: {
                scouting: "btnScoutBossAzuregos",
                looting: "btnSelectLootBossAzuregos",
                stopScouting: "btnStopScoutingBossAzuregos",
                bossSpotted: "btnBossSpottedAzuregos"
            }
        },
        Kazzak: {
            name: "Doom Lord Kazzak",
            type: "Demon",
            color: 0x8E3434,
            channels: {
                scouting: '1220945723592544318',
            },
            btnNames: {
                scouting: "btnScoutBossKazzak",
                looting: "btnSelectLootBossKazzak",
                stopScouting: "btnStopScoutingBossKazzak",
                bossSpotted: "btnBossSpottedKazzak"
            }
        },
        Lethon: {
            name: "Lethon",
            type: "Green Dragon",
            color: 0x348E47,
            channels: {
                scouting: '1220945752692625488',
            },
            btnNames: {
                scouting: "btnScoutBossLethon",
                looting: "btnSelectLootBossLethon",
                stopScouting: "btnStopScoutingBossLethon",
                bossSpotted: "btnBossSpottedLethon"
            }
        },
        Taerar: {
            name: "Taerar",
            type: "Green Dragon",
            color: 0x7D8E34,
            channels: {
                scouting: '1220945782019199037',
            },
            btnNames: {
                scouting: "btnScoutBossTaerar",
                looting: "btnSelectLootBossTaerar",
                stopScouting: "btnStopScoutingBossTaerar",
                bossSpotted: "btnBossSpottedTaerar"
            }
        },
        Ysondre: {
            name: "Ysondre",
            type: "Green Dragon",
            color: 0x348E34,
            channels: {
                scouting: '1220945852525318274',
            },
            btnNames: {
                scouting: "btnScoutBossYsondre",
                looting: "btnSelectLootBossYsondre",
                stopScouting: "btnStopScoutingBossYsondre",
                bossSpotted: "btnBossSpottedYsondre"
            }
        },
        Emriss: {
            name: "Emriss",
            type: "Green Dragon",
            color: 0x348E6D,
            channels: {
                scouting: '1220945812113195129',
            },
            btnNames: {
                scouting: "btnScoutBossEmriss",
                looting: "btnSelectLootBossEmriss",
                stopScouting: "btnStopScoutingBossEmriss",
                bossSpotted: "btnBossSpottedEmriss"
            }
        }
    }
}