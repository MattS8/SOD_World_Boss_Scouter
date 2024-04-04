# SoD World Boss Scout Bot

## Description

A discord bot to help track scouting of world bosses in World of Warcraft Season of Discovery.

## Table of Contents

- [SoD World Boss Scout Bot](#sod-world-boss-scout-bot)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Scouting Functions](#scouting-functions)
    - [BeginScouting](#beginscouting)
    - [EndScouting](#endscouting)
    - [BossSpotted](#bossspotted)
    - [BossKilled](#bosskilled)
  - [Loot Functions](#loot-functions)
    - [StartLootSession](#startlootsession)
    - [SetGuildAttendance](#setguildattendance)
    - [EndLootSession](#endlootsession)
  - [Admin Functions](#admin-functions)
    - [ChangeKeyword](#changekeyword)
    - [ForceBeginScouting](#forcebeginscouting)
    - [ForceEndScouting](#forceendscouting)
    - [EndAllScouting](#endallscouting)
    - [SetLayerCount](#setlayercount)
    - [Bing](#bing)

## Scouting Functions

### BeginScouting

---

### EndScouting

---

### BossSpotted

---

### BossKilled

---

## Loot Functions

### StartLootSession

```js
StartLootSession(creatorId: userId, boss: string)
```

Begins a new loot session, enabling the loot master to set the attendance of each guild, roll off items, and determine the winner. A loot session will last until the user who started the session uses the `EndLootSession` command, or 1 hour has elapsed. Note: a user cannot start another loot session if they have one open already.

#### Params

`creatorId`
| Type | Required |
| :---: | :---: |
| long int | _Yes_ |

`boss`

|  Type  | Required | Default Value |   Values   |          |           |          |           |          |
| :----: | :------: | :-----------: | :--------: | :------: | :-------: | :------: | :-------: | :------: |
| string |   _No_   |    _null_     | "Azuregos" | "Lethon" | "Emeriss" | "Taerar" | "Ysondre" | "Kazzak" |

If present, the name of the boss for which the started loot session is for will appear in the embedded loot message.

#### Example:

```js
CurrentLootSessions = new HashMap();
const { creatorId, startTime, boss, discordMsgId, error } = StartLootSession(
  command.user.id,
  "Azuregos"
);
if (error) {
  return console.error(error.msg);
}
CurrentLootSessions.put(creatorId, {
  id: creatorId,
  startTime: startTime,
  bossName: boss,
  msgId: discordMsgId,
});
```

---

### SetGuildAttendance

```js
SetGuildAttendance(creatorId: userId, guild: string, players: int)
```

Sets the specified guild's attendance for the user's loot session.
**Note:** The user that sent the command must first start a loot session!

#### Params

`creatorId`
| Type | Required |
| :---: | :---: |
| long int | _Yes_ |

`guild`
| Type | Required | Values
| :---: | :---: | :---: |
String | _Yes_ | "SCIENCE" |

`players`
| Type | Required |
| :---: | :---: |
int | _Yes_ |

#### Example:

```js
const result = SetGuildAttendance(command.user.id, "SCIENCE", 44);
if (result === "NoSessionFound")
  return console.error(`No loot session found for user ${commad.user.id}`);
```

---

### EndLootSession

```js
EndLootSession(creatorId: userId)
```

#### Params

`creatorId`
| Type | Required |
| :---: | :---: |
| long int | _Yes_ |

#### Example:

```js
const result = EndLootSession(command.user.id)
if (result === "NoSessionFound)
    return console.error(`No loot session found for user ${command.user.id}`)
```

## Admin Functions

### ChangeKeyword

```js
ChangeKeyword(id: userId, newKeyword: string)
```

Changes the keyword phrase that members should message to get an invite to the raid groups. This keyword will be displayed whenever a boss alert is displayed.

#### Params

`id`
| Type | Required |
| :---: | :---: |
| long int | _Yes_ |

`newKeyword`
| Type | Required |
| :---: | :---: |
| string | _Yes_ |

#### Example:

```js
const result = ChangeKeyword(command.user.id, "SuperSecret");
if (result === "AccessDenied")
  return console.error(
    `User ${command.user.id} does not have permission to change keyword!`
  );
```

---

### ForceBeginScouting

```js
ForceBeginScouting(id: userId, scoutId: userId, layer: int)
```

Manually begins a scouting shift for the specified user. If the user is already marked as scouting by the bot, the entry will be deleted and started anew. If a layer is not specified, the first layer will be assumed.

#### Params

`id`
| Type | Required |
| :---: | :---: |
| long int | _Yes_ |

`scoutId`
| Type | Required |
| :---: | :---: |
| long int | _Yes_ |

`layer`
| Type | Required | Default |
| :---: | :---: | :---: |
| long int | _No_ | 1 |

#### Example

```js
const result = ForceBeginScouting(
  command.user.id,
  GetUserIdFromDisplayName("Beverice")
);
if (result.error) then;
return console.error(result.error.msg);
```

---

### ForceEndScouting

```js
ForceBeginScouting(id: userId, scoutId: userId, layer: int)
```

Manually ends a scouting shift for the specified user. If the user is not marked as scouting by the bot, this command will do nothing. If a layer is not specified, the first occurance of the scouting player will be ended.

#### Params

`id`
| Type | Required |
| :---: | :---: |
| long int | _Yes_ |

`scoutId`
| Type | Required |
| :---: | :---: |
| long int | _Yes_ |

`layer`
| Type | Required | Default |
| :---: | :---: | :---: |
| long int | _No_ | _null_ |

#### Example

```js
const result = ForceEndScouting(
  command.user.id,
  GetUserIdFromDisplayName("Beverice")
);
if (result.error) then;
return console.error(result.error.msg);
```

---

### EndAllScouting

```js
EndAllScouting(id: userId, layer: int, boss: string)
```

Manually ends all scouting shifts. If a layer is specified, only shifts on the given layer will be ended. If a boss is specified, only shifts for the given boss will be ended (you can specify "Green Dragons" to end all green dragon shifts). These two can be combined to only end shifts for a specific entity.

#### Params

`id`
| Type | Required |
| :---: | :---: |
| long int | _Yes_ |

`layer`
| Type | Required | Default Value|
| :---: | :---: | :---: |
| int | _No_ | _null_ |

`boss`
| Type | Required | Default Value | Values|||||||
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| string | _No_ | _null_ |"Azuregos" | "Lethon" | "Emeriss" | "Taerar" | "Ysondre" | "Kazzak" | "Green Dragons" |

#### Example

```js
const result = EndAllScouting(command.user.id, 2, "Green Dragons");
if (result.error) then;
return console.error(result.error.msg);
```

---

### SetLayerCount

```js
SetLayerCount(id: userId, numLayers: int)
```

Changes the number of layers to the specified amount. If the number of layers is decreased, and there are players currently scouting on nonexistent layers, a warning will appear and all affected scouts will have their shifts automatically ended.

#### Params

`id`
| Type | Required |
| :---: | :---: |
| long int | _Yes_ |

`numLayers`
| Type | Required |
| :---: | :---: |
| int | _Yes_ |

#### Example

```js
const result = SetLayerCount(command.user.id, 10);
if (result.error) then;
return console.error(result.error.msg);
```

---

### Bing

```js
bing();
```

Pings the bot and returns `bong` on success. Bing bong!
