// commandes/kick.js module.exports = { name: ".kick", groupOnly: true, adminOnly: true,

run: async (sock, msg, metadata) => { const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []; const botAdmin = metadata.participants.find(p => p.id === sock.user.id)?.admin; const senderAdmin = metadata.participants.find(p => p.id === msg.key.participant)?.admin;

if (!botAdmin) {
  return sock.sendMessage(msg.key.remoteJid, {
    text: "❌ Je ne suis pas admin !"
  });
}

if (!senderAdmin) {
  return sock.sendMessage(msg.key.remoteJid, {
    text: "❌ Tu dois être admin pour utiliser cette commande."
  });
}

if (!mentioned[0]) {
  return sock.sendMessage(msg.key.remoteJid, {
    text: "❌ Mentionne un utilisateur à expulser."
  });
}

const targetIsAdmin = metadata.participants.find(p => p.id === mentioned[0])?.admin;
if (targetIsAdmin) {
  return sock.sendMessage(msg.key.remoteJid, {
    text: "❌ Je ne peux pas expulser un admin."
  });
}

await sock.groupParticipantsUpdate(msg.key.remoteJid, [mentioned[0]], "remove");
await sock.sendMessage(msg.key.remoteJid, {
  text: `✅ @${mentioned[0].split("@")[0]} a été expulsé.`,
  mentions: mentioned
});

} };

// commandes/banadmin.js module.exports = { name: ".banadmin",

run: async (sock, msg) => { await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Tentative de bannissement de l'administrateur... ❌ Action refusée : WhatsApp ne permet pas d'expulser un admin automatiquement 😅" }); } };

// commandes/promote.js module.exports = { name: ".promote", groupOnly: true, adminOnly: true,

run: async (sock, msg, metadata) => { const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []; const botAdmin = metadata.participants.find(p => p.id === sock.user.id)?.admin;

if (!botAdmin) {
  return sock.sendMessage(msg.key.remoteJid, {
    text: "❌ Je ne suis pas admin !"
  });
}

if (!mentioned[0]) {
  return sock.sendMessage(msg.key.remoteJid, {
    text: "❌ Mentionne un utilisateur à promouvoir."
  });
}

await sock.groupParticipantsUpdate(msg.key.remoteJid, [mentioned[0]], "promote");
await sock.sendMessage(msg.key.remoteJid, {
  text: `✅ @${mentioned[0].split("@")[0]} est maintenant admin.`,
  mentions: mentioned
});

} };

// commandes/demote.js module.exports = { name: ".demote", groupOnly: true, adminOnly: true,

run: async (sock, msg, metadata) => { const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []; const botAdmin = metadata.participants.find(p => p.id === sock.user.id)?.admin;

if (!botAdmin) {
  return sock.sendMessage(msg.key.remoteJid, {
    text: "❌ Je ne suis pas admin !"
  });
}

if (!mentioned[0]) {
  return sock.sendMessage(msg.key.remoteJid, {
    text: "❌ Mentionne un utilisateur à rétrograder."
  });
}

await sock.groupParticipantsUpdate(msg.key.remoteJid, [mentioned[0]], "demote");
await sock.sendMessage(msg.key.remoteJid, {
  text: `✅ @${mentioned[0].split("@")[0]} n'est plus admin.`,
  mentions: mentioned
});

} };

// commandes/groupinfo.js module.exports = { name: ".groupinfo", groupOnly: true,

run: async (sock, msg) => { const metadata = await sock.groupMetadata(msg.key.remoteJid); const adminCount = metadata.participants.filter(p => p.admin).length;

let info = `📄 *Informations du groupe*\n`;
info += `🏷️ Nom: ${metadata.subject}\n`;
info += `👤 Membres: ${metadata.participants.length}\n`;
info += `🛡️ Admins: ${adminCount}\n`;
info += `🔒 ID: ${metadata.id}`;

await sock.sendMessage(msg.key.remoteJid, { text: info });

} };

