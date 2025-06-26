// 📁 commandes/bot-commands.js — Commandes centrales du bot SYNTAX_NO-DARA

module.exports = {
  // 🔁 Voir (vue unique)
  ".voir": {
    groupOnly: false,
    adminOnly: false,
    ownerOnly: false,
    run: async (sock, msg) => {
      const media = msg.message?.viewOnceMessage?.message;
      if (!media) return sock.sendMessage(msg.key.remoteJid, { text: "Aucun média vue unique trouvé." });
      await sock.sendMessage(msg.key.remoteJid, media);
    }
  },

  // 📊 Rank utilisateur
  ".rank": {
    groupOnly: false,
    adminOnly: false,
    ownerOnly: false,
    run: async (sock, msg) => {
      sock.sendMessage(msg.key.remoteJid, {
        text: `👤 Profil de ${msg.pushName}\n⭐ Niveau: 5\n📈 XP: 1200/1500`
      });
    }
  },

  // 🔥 Kick All (sauf admin)
  ".kickall": {
    groupOnly: true,
    adminOnly: true,
    run: async (sock, msg) => {
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const admins = metadata.participants.filter(p => p.admin);
      const targets = metadata.participants.filter(p => !p.admin);
      for (let user of targets) {
        await sock.groupParticipantsUpdate(msg.key.remoteJid, [user.id], "remove");
      }
      sock.sendMessage(msg.key.remoteJid, { text: "Tous les membres non-admin ont été expulsés." });
    }
  },

  // 😊 Réactions (GIFs)
  ".réactions": {
    groupOnly: false,
    run: async (sock, msg) => {
      const gifType = msg.message?.conversation?.split(" ")[1] || "heureux";
      const gifs = {
        heureux: "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
        encolere: "https://media.giphy.com/media/TqiwHbFBaZ4ti/giphy.gif",
        giflé: "https://media.giphy.com/media/l0K4kWJir91VEoa1W/giphy.gif",
        bisous: "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif"
      };
      await sock.sendMessage(msg.key.remoteJid, {
        video: { url: gifs[gifType] || gifs.heureux },
        caption: `GIF: ${gifType}`
      });
    }
  },

  // 🔞 Hentai (image)
  ".hentail": {
    run: async (sock, msg) => {
      const axios = require("axios");
      const { data } = await axios.get(`https://api.lolhuman.xyz/api/random/nsfw/hentai?apikey=${process.env.LOLHUMAN_API_KEY}`);
      await sock.sendMessage(msg.key.remoteJid, { image: { url: data.result }, caption: "🔞 Image Hentail" });
    }
  },

  // 🔞 Hentai Vidéo
  ".hentailvideo": {
    run: async (sock, msg) => {
      const axios = require("axios");
      const { data } = await axios.get(`https://api.lolhuman.xyz/api/random/nsfw/hentaivid?apikey=${process.env.LOLHUMAN_API_KEY}`);
      await sock.sendMessage(msg.key.remoteJid, { video: { url: data.result }, caption: "🔞 Vidéo Hentail" });
    }
  },

  // 🔎 Recherche Google
  ".recherche": {
    run: async (sock, msg) => {
      const query = msg.message?.conversation?.split(" ").slice(1).join(" ");
      if (!query) return sock.sendMessage(msg.key.remoteJid, { text: "Veuillez fournir des mots-clés." });
      const axios = require("axios");
      const { data } = await axios.get(`https://api.lolhuman.xyz/api/gsearch?apikey=${process.env.LOLHUMAN_API_KEY}&query=${encodeURIComponent(query)}`);
      sock.sendMessage(msg.key.remoteJid, {
        text: `🔍 Résultats de recherche:\n${data.result.slice(0, 3).map(r => `• ${r.title}\n${r.link}`).join("\n\n")}`
      });
    }
  },

  // 👥 Tag 1 membre
  ".tag": {
    groupOnly: true,
    adminOnly: true,
    run: async (sock, msg) => {
      const mention = msg.message?.extendedTextMessage?.contextInfo?.participant;
      if (!mention) return sock.sendMessage(msg.key.remoteJid, { text: "Tag un utilisateur." });
      await sock.sendMessage(msg.key.remoteJid, {
        text: `@${mention.split("@")[0]}`,
        mentions: [mention]
      });
    }
  },

  // 👥 Tag All
  ".tagall": {
    groupOnly: true,
    adminOnly: true,
    run: async (sock, msg) => {
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const mentions = metadata.participants.map(p => p.id);
      await sock.sendMessage(msg.key.remoteJid, {
        text: "📢 @everyone",
        mentions
      });
    }
  },

  // 📢 Annonce
  ".annonce": {
    groupOnly: true,
    adminOnly: true,
    run: async (sock, msg) => {
      const texte = msg.message?.conversation?.split(" ").slice(1).join(" ") || "📢 Annonce !";
      const metadata = await sock.groupMetadata(msg.key.remoteJid);
      const mentions = metadata.participants.map(p => p.id);
      await sock.sendMessage(msg.key.remoteJid, {
        text: texte,
        mentions
      });
    }
  },

  // 🔗 URL d'image
  ".url": {
    run: async (sock, msg) => {
      const image = msg.message?.imageMessage;
      if (!image) return sock.sendMessage(msg.key.remoteJid, { text: "Envoie une image avec la commande." });
      const buffer = await sock.downloadMediaMessage(msg);
      const base64 = buffer.toString("base64");
      sock.sendMessage(msg.key.remoteJid, { text: `data:image/jpeg;base64,${base64}` });
    }
  },

  // 🖼️ Pinterest
  ".pint": {
    run: async (sock, msg) => {
      const query = msg.message?.conversation?.split(" ").slice(1).join(" ");
      if (!query) return sock.sendMessage(msg.key.remoteJid, { text: "Spécifie un mot-clé." });
      const axios = require("axios");
      const { data } = await axios.get(`https://api.lolhuman.xyz/api/pinterest?apikey=${process.env.LOLHUMAN_API_KEY}&query=${encodeURIComponent(query)}`);
      sock.sendMessage(msg.key.remoteJid, { image: { url: data.result }, caption: `🖼️ Pinterest: ${query}` });
    }
  },

  // 🆎 Style de texte
  ".style": {
    run: async (sock, msg) => {
      const texte = msg.message?.conversation?.split(" ").slice(1).join(" ");
      if (!texte) return sock.sendMessage(msg.key.remoteJid, { text: "Entrez du texte." });
      const axios = require("axios");
      const { data } = await axios.get(`https://api.lolhuman.xyz/api/styletext?apikey=${process.env.LOLHUMAN_API_KEY}&text=${encodeURIComponent(texte)}`);
      const styled = Object.values(data.result).slice(0, 5).join("\n");
      sock.sendMessage(msg.key.remoteJid, { text: `🎨 Texte stylisé :\n${styled}` });
    }
  },

  // 📦 Repo du bot
  ".repo": {
    run: async (sock, msg) => {
      sock.sendMessage(msg.key.remoteJid, { text: `🧠 Lien GitHub: ${process.env.REPO_LINK}` });
    }
  },

  // 🙋‍♂️ Welcome automatique
  ".welcome": {
    groupOnly: true,
    run: async (sock, msg) => {
      sock.sendMessage(msg.key.remoteJid, {
        text: `👋 Bienvenue ${msg.pushName} dans le groupe ${msg.key.remoteJid.split("@")[0]}`
      });
    }
  },

  // 🛡️ Anti-Spam
  ".anti-spam": {
    ownerOnly: true,
    run: async (sock, msg) => {
      process.env.ANTI_SPAM = process.env.ANTI_SPAM === "true" ? "false" : "true";
      sock.sendMessage(msg.key.remoteJid, { text: `🛡️ Anti-Spam: ${process.env.ANTI_SPAM}` });
    }
  },

  // 🖼️ Changer la photo du bot
  ".changerphoto": {
    ownerOnly: true,
    run: async (sock, msg) => {
      const image = msg.message?.imageMessage;
      if (!image) return sock.sendMessage(msg.key.remoteJid, { text: "Envoie une image avec la commande." });
      const buffer = await sock.downloadMediaMessage(msg);
      await sock.updateProfilePicture(sock.user.id, buffer);
      sock.sendMessage(msg.key.remoteJid, { text: "🖼️ Photo mise à jour avec succès." });
    }
  },

  // 🚨 Signaler un membre
  ".signaler": {
    groupOnly: true,
    run: async (sock, msg) => {
      const mention = msg.message?.extendedTextMessage?.contextInfo?.participant;
      if (!mention) return sock.sendMessage(msg.key.remoteJid, { text: "Tag un utilisateur à signaler." });
      sock.sendMessage(msg.key.remoteJid, {
        text: `⚠️ @${mention.split("@")[0]} a été signalé.`,
        mentions: [mention]
      });
    }
  },

  // 🔁 Spam un numéro
  ".spam": {
    ownerOnly: true,
    run: async (sock, msg) => {
      const args = msg.message?.conversation?.split(" ");
      const number = args[1];
      const count = parseInt(args[2]) || 5;
      if (!number) return sock.sendMessage(msg.key.remoteJid, { text: "Usage: .spam numéro nombre" });
      for (let i = 0; i < count; i++) {
        await sock.sendMessage(`${number}@s.whatsapp.net`, { text: `🔁 SPAM ${i + 1}` });
      }
    }
  },

  // 🔧 Restaurer un compte
  ".restore": {
    run: async (sock, msg) => {
      sock.sendMessage(msg.key.remoteJid, { text: "✅ Restauration simulée. Veuillez réessayer la connexion officielle." });
    }
  },

  // 📈 Promote un membre
  ".promote": {
    groupOnly: true,
    adminOnly: true,
    run: async (sock, msg) => {
      const mention = msg.message?.extendedTextMessage?.contextInfo?.participant;
      if (!mention) return sock.sendMessage(msg.key.remoteJid, { text: "Tag une personne à promouvoir." });
      await sock.groupParticipantsUpdate(msg.key.remoteJid, [mention], "promote");
      sock.sendMessage(msg.key.remoteJid, {
        text: `✅ @${mention.split("@")[0]} promu admin.`,
        mentions: [mention]
      });
    }
  },

  // 📉 Demote un membre
  ".demote": {
    groupOnly: true,
    adminOnly: true,
    run: async (sock, msg) => {
      const mention = msg.message?.extendedTextMessage?.contextInfo?.participant;
      if (!mention) return sock.sendMessage(msg.key.remoteJid, { text: "Tag une personne à rétrograder." });
      await sock.groupParticipantsUpdate(msg.key.remoteJid, [mention], "demote");
      sock.sendMessage(msg.key.remoteJid, {
        text: `🔻 @${mention.split("@")[0]} n'est plus admin.`,
        mentions: [mention]
      });
    }
  }
};
