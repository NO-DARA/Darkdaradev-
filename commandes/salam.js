module.exports = {
  name: ".salam",
  run: async (sock, msg) => {
    await sock.sendMessage(msg.key.remoteJid, {
      text: "Wa 3alaykoum salam 👊 SYNTAX_NO-DARA est en ligne !"
    });
  }
};
