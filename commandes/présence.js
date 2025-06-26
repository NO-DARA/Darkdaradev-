module.exports = {
  name: ".presence",
  run: async (sock, msg) => {
    await sock.sendPresenceUpdate("available", msg.key.remoteJid);
    await sock.sendMessage(msg.key.remoteJid, { text: "🟢 Je suis en ligne !" });
  }
};
