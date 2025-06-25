const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
const P = require("pino");
const fs = require("fs");
const figlet = require("figlet");
const chalk = require("chalk");

console.log(chalk.cyan(figlet.textSync("SYNTAX_NO-DARA", { horizontalLayout: "default" })));

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P({ level: "silent" }))
    },
    browser: ["SYNTAX_NO-DARA", "Chrome", "106.0.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log(chalk.green("✅ SYNTAX_NO-DARA connecté avec succès à WhatsApp !"));
    } else if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        console.log(chalk.yellow("🔁 Reconnexion en cours..."));
        startBot();
      } else {
        console.log(chalk.red("❌ Déconnecté. Veuillez relancer le bot."));
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const messageType = Object.keys(msg.message)[0];
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

    console.log(`📩 Message reçu de ${sender}: ${text}`);

    if (text === ".salam") {
      await sock.sendMessage(sender, { text: "Wa 3alaykoum salam mon frère 👊" });
    } else if (text === ".menu") {
      await sock.sendMessage(sender, {
        text: `
╔═══📜 MENU SYNTAX_NO-DARA 📜═══╗
║ .salam   → Salutation
║ .menu    → Afficher ce menu
║ .owner   → Info sur le créateur
╚══════════════════════════════╝
        `.trim()
      });
    } else if (text === ".owner") {
      await sock.sendMessage(sender, {
        text: `👑 Ce bot appartient à TomBot422 alias SYNTAX_NO-DARA.`
      });
    }
  });
}

startBot();
