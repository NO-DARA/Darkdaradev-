// 📁 commandes/bot-commands.js — Commandes centrales du bot SYNTAX_NO-DARA

module.exports = { // ... commandes précédentes ...

// 🙋‍♂️ Welcome automatique ".welcome": { groupOnly: true, run: async (sock, msg) => { sock.sendMessage(msg.key.remoteJid, { text: process.env.WELCOME_MSG?.replace("@user", msg.pushName).replace("@group", msg.key.remoteJid.split("@")[0]) || Bienvenue ${msg.pushName} }); } },

// 🛡️ Anti-Spam activé/désactivé (owner only) ".anti-spam": { ownerOnly: true, run: async (sock, msg) => { process.env.ANTI_SPAM = process.env.ANTI_SPAM === "true" ? "false" : "true"; sock.sendMessage(msg.key.remoteJid, { text: 🛡️ Anti-Spam: ${process.env.ANTI_SPAM} }); } },

// 🖼️ Changer la photo du bot ".changerphoto": { ownerOnly: true, run: async (sock, msg) => { const image = msg.message?.imageMessage; if (!image) return sock.sendMessage(msg.key.remoteJid, { text: "Envoie une image avec la commande." }); const buffer = await sock.downloadMediaMessage(msg); await sock.updateProfilePicture(sock.user.id, buffer); sock.sendMessage(msg.key.remoteJid, { text: "🖼️ Photo de profil mise à jour avec succès." }); } },

// 🚨 Signaler un membre (fictif, à adapter à ton système) ".signaler": { groupOnly: true, run: async (sock, msg) => { const mention = msg.message?.extendedTextMessage?.contextInfo?.participant; if (!mention) return sock.sendMessage(msg.key.remoteJid, { text: "Tag un utilisateur à signaler." }); sock.sendMessage(msg.key.remoteJid, { text: ⚠️ @${mention.split("@")[0]} a été signalé., mentions: [mention] }); } },

// 📨 Spam un numéro (usage responsable recommandé) ".spam": { ownerOnly: true, run: async (sock, msg) => { const args = msg.message?.conversation?.split(" "); const number = args[1]; const count = parseInt(args[2]) || 5; if (!number) return sock.sendMessage(msg.key.remoteJid, { text: "Usage: .spam numéro nombre" }); for (let i = 0; i < count; i++) { await sock.sendMessage(${number}@s.whatsapp.net, { text: 🔁 SPAM ${i + 1} }); } } },

// 🔧 Restaurer un compte (simule un contournement) ".restore": { run: async (sock, msg) => { sock.sendMessage(msg.key.remoteJid, { text: "✅ Restauration simulée. Veuillez réessayer la connexion officielle." }); } },

// 📈 Promote un membre ".promote": { groupOnly: true, adminOnly: true, run: async (sock, msg) => { const mention = msg.message?.extendedTextMessage?.contextInfo?.participant; if (!mention) return sock.sendMessage(msg.key.remoteJid, { text: "Tag une personne à promouvoir." }); await sock.groupParticipantsUpdate(msg.key.remoteJid, [mention], "promote"); sock.sendMessage(msg.key.remoteJid, { text: ✅ @${mention.split("@")[0]} promu admin., mentions: [mention] }); } },

// 📉 Demote un membre ".demote": { groupOnly: true, adminOnly: true, run: async (sock, msg) => { const mention = msg.message?.extendedTextMessage?.contextInfo?.participant; if (!mention) return sock.sendMessage(msg.key.remoteJid, { text: "Tag une personne à rétrograder." }); await sock.groupParticipantsUpdate(msg.key.remoteJid, [mention], "demote"); sock.sendMessage(msg.key.remoteJid, { text: 🔻 @${mention.split("@")[0]} n'est plus admin., mentions: [mention] }); } } };

