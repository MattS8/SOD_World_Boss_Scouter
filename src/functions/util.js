const fs = require('fs');

module.exports = (DiscordClient) => {
    DiscordClient.sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
}