const assert = require("assert");
const { DiscordClient, GoogleAuth } = require("../src/main.js");
const Utils = require("../src/util.js");

describe("Utils", () => {
  describe("#convertSheetDataToScoutData", () => {
    it("Should return an object with no scouting time, a username, displayname, and discordId", () => {
      const result = Utils.convertSheetDataToScoutData(
        ["WingTzu", "<SCIENCE> Wing", "12345", 0, 0, 0, 0, 0, 0, 0],
        [
          "Discord Username",
          "Discord Display Name",
          "Discord ID",
          "Azurgos",
          "Kazzak",
          "Duskwood",
          "Ashenvale",
          "Feralas",
          "Hinterlands",
          "Total",
        ]
      );

      assert.strictEqual(result["Discord Username"], "WingTzu");
      assert.strictEqual(result["Discord Display Name"], "<SCIENCE> Wing");
      assert.strictEqual(result["Discord ID"], "12345");
      assert.strictEqual(result["Azurgos"], 0);
      assert.strictEqual(result["Kazzak"], 0);
      assert.strictEqual(result["Duskwood"], 0);
      assert.strictEqual(result["Ashenvale"], 0);
      assert.strictEqual(result["Feralas"], 0);
      assert.strictEqual(result["Hinterlands"], 0);
      assert.strictEqual(result["Total"], 0);
    });
  });

  describe("#convertScoutObjToSheetData", () => {
    it("Should return an array of arrays in the format for google sheets", () => {
      const result = Utils.convertScoutObjToSheetData(
        {
          "Discord Username": "WingTzu",
          "Discord Display Name": "<SCIENCE> Wing",
          "Discord ID": "12345",
          Azurgos: 0,
          Kazzak: 0,
          Duskwood: 0,
          Ashenvale: 0,
          Feralas: 0,
          Hinterlands: 0,
          Total: 0,
        },
        [
          "Discord Username",
          "Discord Display Name",
          "Discord ID",
          "Azurgos",
          "Kazzak",
          "Duskwood",
          "Ashenvale",
          "Feralas",
          "Hinterlands",
          "Total",
        ]
      );

      const expected = ["WingTzu","<SCIENCE> Wing","12345", 0, 0,  0, 0, 0, 0, 0];
      let index = 0;
      for (i of result) {
        assert.strictEqual(i, expected[index]);
        ++index;
      }
    });
  });
});
