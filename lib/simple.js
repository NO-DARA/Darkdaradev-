module.exports = {
  command: ".hello",
  run: async (sock, msg) => {
    await sock.sendMessage(msg.key.remoteJid, { text: "Hello depuis SYNTAX_NO-DARA 👋" });
  }
};
