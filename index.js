const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const fs = require('fs');

// Authentification via fichier session
const { state, saveState } = useSingleFileAuthState('./session.json');

async function startBot() {
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true, // Affiche le QR dans Replit
    auth: state
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("⛔ Connexion perdue. Reconnexion :", shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log("✅ Bot connecté à WhatsApp !");
    }
  });

  sock.ev.on('messages.upsert', async (msgUpdate) => {
    const msg = msgUpdate.messages[0];
    if (!msg.message || msg.key.fromMe) return;
    
    const messageContent = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    if (messageContent.toLowerCase() === "ping") {
      await sock.sendMessage(msg.key.remoteJid, { text: "pong 🏓" }, { quoted: msg });
    }
  });
}

startBot();
