const telegramBot = require("./telegramBot");

const sendMessage = async function (id, message) {
  if (id) {
    await telegramBot.sendMessage(id, message);
  }
};

module.exports = sendMessage;
