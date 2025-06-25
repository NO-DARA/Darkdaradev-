require("dotenv").config();

module.exports = {
  ownerName: process.env.OWNER_NAME || "NO-DARA",
  botName: process.env.BOT_NAME || "SYNTAX_NO-DARA",
  apiKey: process.env.API_KEY,
  session: process.env.SESSION_NAME || "auth_info"
};
