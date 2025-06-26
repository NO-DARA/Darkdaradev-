// 📁 index.js - Point d'entrée principal du bot SYNTAX_NO-DARA

require("dotenv").config(); const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys"); const { Boom } = require("@hapi/boom"); const fs = require("fs"); const path = require("path"); const commands = require("./commandes/bot-commands"); const config = require("./set");

// 🔐 Chargement de l'authentification async function startBot() { const { state, saveCreds } = await useMultiFileAuthState("session"); const { version } = await fetchLatestBaileysVersion();

const sock = makeWASocket({ version, printQRInTerminal: true, auth: state, browser: [config.BOT_NAME, "Chrome", "1.0"], });

sock.ev.on("creds.update", saveCreds);

sock.ev.on("connection.update", (update) => { const { connection, lastDisconnect } = update; if (connection === "close") { const shouldReconnect = (lastDisconnect?.error instanceof Boom) && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut; if (shouldReconnect) startBot(); else console.log("📴 Déconnecté définitivement."); } else if (connection === "open") { console.log("✅ SYNTAX_NO-DARA est connecté avec succès."); } });

sock.ev.on("messages.upsert", async ({ messages }) => { const msg = messages[0]; if (!msg.message || msg.key.fromMe) return;

const type = Object.keys(msg.message)[0];
const body = msg.message[type]?.text || msg.message[type]?.caption || "";
const commandName = body?.trim().split(" ")[0];

const command = commands[commandName];
if (!command) return;

// 🔐 Vérification si admin ou owner pour certaines commandes
const sender = msg.key.participant || msg.key.remoteJid;
const isGroup = msg.key.remoteJid.endsWith("@g.us");
const metadata = isGroup ? await sock.groupMetadata(msg.key.remoteJid) : null;
const isAdmin = isGroup ? metadata.participants.find(p => p.id === sender)?.admin : false;
const isOwner = sender.includes(config.OWNER_NUMBER);

if (command.ownerOnly && !isOwner) return sock.sendMessage(msg.key.remoteJid, { text: "⛔ Commande réservée au propriétaire." });
if (command.adminOnly && !isAdmin) return sock.sendMessage(msg.key.remoteJid, { text: "⛔ Commande réservée aux administrateurs." });
if (command.groupOnly && !isGroup) return sock.sendMessage(msg.key.remoteJid, { text: "⛔ Cette commande ne fonctionne que dans un groupe." });

try {
  await command.run(sock, msg);
} catch (e) {
  console.error("❌ Erreur dans la commande:", e);
  sock.sendMessage(msg.key.remoteJid, { text: "❌ Une erreur est survenue dans la commande." });
}

}); }

startBot();

                                   
