module.exports = {
  name: ".autoadmin",
  groupOnly: true,
  adminOnly: true,

  run: async (sock, msg, metadata) => {
    const config = require("../set");
    const owner = config.ownerNumber || "243xxxx@s.whatsapp.net";
    const groupAdmins = metadata.participants.filter(p => p.admin).map(p => p.id);

    if (!groupAdmins.includes(sock.user.id)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "❌ Je ne suis pas admin dans ce groupe, je ne peux pas promouvoir qui que ce soit."
      });
    }

    if (groupAdmins.includes(owner)) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: "✅ Le propriétaire est déjà admin de ce groupe."
      });
    }

    try {
      await sock.groupParticipantsUpdate(msg.key.remoteJid, [owner], "promote");
      await sock.sendMessage(msg.key.remoteJid, {
        text: `👑 Le propriétaire @${owner.split("@")[0]} a été promu administrateur.`,
        mentions: [owner]
      });
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: "❌ Erreur lors de la promotion." });
    }
  }
};
