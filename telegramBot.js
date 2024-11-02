const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot("12345:abcdefghijk-lmnop", {
  polling: false,
});

module.exports = bot;
