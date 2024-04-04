require('dotenv').config()
require('./constants.js').Enums.InputName

module.exports = {
  General: {
    botName: 'SoD Boss Scouter',
    botOwner: 'WingTzu',
    version: '0.1',
    serverTimezone: '-0700',
    dateFormats: {
      default: {
        weekday: 'long',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/Los_Angeles'
      }
    },
    errorColor: 0xc12115
  },
  Server: {
    id: '1219312419554332673',
    admins: ['239194797406027777'],
    channels: {
      alert: {
        id: '1219318233853722634'
      },
      scouting: {
        id: '1219318268628570112'
      },
      loot: {
        id: '1219320056274616321'
      },
      scoutLogs: {
        id: '1225260944113008652'
      }
    }
  },
  Guilds: [
    {
      tag: 'SCIENCE',
      name: 'SCIENCE',
      color: 16777215,
      sayings: ['%s is scouting %b.']
    },
    {
      tag: 'Fury',
      name: 'Fury',
      color: 16779215,
      sayings: ['%s is scouting %b.']
    }
  ],
  Sheets: {
    Credentials: {
      installed: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        project_id: process.env.GOOGLE_PROJECT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: process.env.GOOGLE_SECRET,
        redirect_uris: ['http://localhost']
      }
    },
    Attendance: {
      name: 'SoD World Boss Scouting',
      id: '1tW2dVGE8wVtRIzoZhuXce64ZWcOhsovFxkG_P07KxuA',
      separator: '\n'
    },
    Calendar: {
      id: '1HNxhS4tJ8VEz6DQ-swnLdGEPYV0GI-byyE_dPzs0bxM',
      separator: '\n',
      datePattern: 'm/d'
    },
    BossLogs: {
      name: 'Boss Logs (Test)',
      id: ''
    }
  },
  Scouting: {
    Azuregos: {
      name: 'Azuregos',
      type: 'Blue Dragon',
      zone: 'Azshara',
      color: 0x0e44ce,
      channel: '1220945685424115782',
      btnNames: {
        scouting: 'btnScoutAzuregos',
        stopScouting: 'btnStopScoutingAzuregos',
        bossSpotted: 'btnBossSpottedAzuregos'
      }
    },
    Kazzak: {
      name: 'Doom Lord Kazzak',
      type: 'Demon',
      zone: 'Blasted Lands',
      color: 0x8e3434,
      channel: '1220945723592544318',
      btnNames: {
        scouting: 'btnScoutKazzak',
        stopScouting: 'btnStopScoutingKazzak',
        bossSpotted: 'btnBossSpottedKazzak'
      }
    },
    Duskwood: {
      name: 'Duskwood Dragon',
      type: 'Green Dragon',
      zone: 'Duskwood',
      color: 0x348e47,
      channel: '1220945752692625488',
      btnNames: {
        scouting: 'btnScoutDuskwoodDragon',
        stopScouting: 'btnStopScoutingDuskwoodDragon',
        bossSpotted: 'btnBossSpottedGreenDragon'
      }
    },
    Feralas: {
      name: 'Feralas Dragon',
      type: 'Green Dragon',
      zone: 'Feralas',
      color: 0x348e47,
      channel: '1220945812113195129',
      btnNames: {
        scouting: 'btnScoutFeralasDragon',
        stopScouting: 'btnStopScoutingFeralasDragon',
        bossSpotted: 'btnBossSpottedGreenDragon'
      }
    },
    Hinterlands: {
      name: 'Hinterlands Dragon',
      type: 'Green Dragon',
      zone: 'Hinterlands',
      color: 0x348e47,
      channel: '1220945782019199037',
      btnNames: {
        scouting: 'btnScoutHinterlandsDragon',
        stopScouting: 'btnStopScoutingHinterlandsDragon',
        bossSpotted: 'btnBossSpottedGreenDragon'
      }
    },
    Ashenvale: {
      name: 'Ashenvale Dragon',
      type: 'Green Dragon',
      zone: 'Ashenvale',
      color: 0x348e47,
      channel: '1220945852525318274',
      btnNames: {
        scouting: 'btnScoutAshenvaleDragon',
        stopScouting: 'btnStopScoutingAshenvaleDragon',
        bossSpotted: 'btnBossSpottedGreenDragon'
      }
    }
  },
  Bosses: {
    Azuregos: {
      name: 'Azuregos',
      type: 'Blue Dragon',
      color: 0x0e44ce,
      btnNames: {
        looting: 'btnSelectLootBossAzuregos'
      }
    },
    Kazzak: {
      name: 'Doom Lord Kazzak',
      type: 'Demon',
      color: 0x8e3434,
      btnNames: {
        looting: 'btnSelectLootBossKazzak'
      }
    },
    Lethon: {
      name: 'Lethon',
      type: 'Green Dragon',
      color: 0x348e47,
      btnNames: {
        looting: 'btnSelectLootBossLethon'
      }
    },
    Taerar: {
      name: 'Taerar',
      type: 'Green Dragon',
      color: 0x7d8e34,
      btnNames: {
        looting: 'btnSelectLootBossTaerar'
      }
    },
    Ysondre: {
      name: 'Ysondre',
      type: 'Green Dragon',
      color: 0x348e34,
      btnNames: {
        looting: 'btnSelectLootBossYsondre'
      }
    },
    Emriss: {
      name: 'Emriss',
      type: 'Green Dragon',
      color: 0x348e6d,
      btnNames: {
        looting: 'btnSelectLootBossEmriss'
      }
    }
  },
  SummonLocations: ['Feralas', 'Azshara', 'Duskwood', 'Hinterlands', 'Badlands']
}
