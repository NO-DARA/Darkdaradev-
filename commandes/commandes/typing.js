module.exports = {
  name: ".typing",
  run: async (sock, msg) => {
    await sock.sendPresenceUpdate("composing", msg.key.remoteJid);
    setTimeout(async () => {
      await sock.sendMessage(msg.key.remoteJid, { text: "✍️ Voilà ! J’étais en train d’écrire..." });
    }, 2000);
  }
};
