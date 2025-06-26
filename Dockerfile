# 📦 Base légère avec Node.js 20
FROM node:20-alpine

# 📁 Dossier de travail dans le conteneur
WORKDIR /app

# 📄 Copie du fichier package.json + lock (si présent)
COPY package.json ./
COPY package-lock.json ./

# 📦 Installation des dépendances
RUN npm install

# 📄 Copie de tous les fichiers de ton bot
COPY . .

# 📂 Création du dossier de session si inexistant
RUN mkdir -p session

# 📢 Exposition d'un port fictif (Baileys utilise WebSocket, pas HTTP)
EXPOSE 3000

# ▶️ Commande de démarrage
CMD ["node", "index.js"]
