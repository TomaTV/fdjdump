# Chatbot Bancaire avec Limdu et MySQL

Ce projet est un chatbot bancaire utilisant **Limdu** pour le traitement du langage naturel (NLP) et **MySQL** pour la gestion des données utilisateur. Il permet d'interagir avec une base de données pour consulter le solde, l'historique des transactions, retirer de l'argent, effectuer des virements et créer un compte.

## 📌 Fonctionnalités

- 🧠 **Détection d'intention** avec **Limdu**
- 🏦 **Connexion à une base de données MySQL**
- 👤 **Création et connexion à un compte utilisateur**
- 💰 **Consultation du solde et historique des transactions**
- 💸 **Virements et retraits d'argent**
- 💳 **Gestion des cartes bancaires**
- 🏷️ **Consultation des offres disponibles**

## 🛠️ Installation et Configuration

### 1️⃣ Prérequis

- [Node.js](https://nodejs.org/) installé
- [MySQL](https://www.mysql.com/) installé et configuré
- [XAMPP](https://www.apachefriends.org/fr/index.html) si besoin d'un environnement local

### 2️⃣ Installation des dépendances

Clone le projet et installe les dépendances :

```sh
git clone https://github.com/TomaTV/fdjdump.git
cd fdjdump
npm install
```

### 3️⃣ Configuration de la base de données

1. Créer une base de données MySQL nommée `FDJDump`
2. Exécuter le script SQL dans `database.sql` pour créer les tables et insérer les données de test

### 4️⃣ Démarrer le chatbot

```sh
node chatbot.js
```

## 💬 Utilisation

Une fois le chatbot démarré, vous pouvez interagir avec lui en utilisant des commandes en langage naturel comme :

- "Bonjour" ou "Salut" pour commencer
- "Se connecter" ou "J'ai un compte" pour vous connecter
- "Nouveau client" ou "Je veux créer un compte" pour créer un compte
- "Voir mon solde" pour consulter votre solde
- "Faire un virement" pour effectuer un virement
- "Retirer de l'argent" pour effectuer un retrait
- "Voir mes cartes" pour consulter vos cartes bancaires
- "Voir les offres disponibles" pour consulter les offres

## 📁 Structure du Projet

Le projet a été organisé de manière modulaire, avec un fichier distinct pour chaque type de conversation :

- `/conversations` : Dossier contenant les modules de conversation (création de compte, virement, solde, etc.)
- `/config` : Configuration de la base de données et données d'entraînement NLP
- `conversationRouter.js` : Système de routage des conversations
- `chatbot.js` : Point d'entrée principal

Pour plus de détails sur l'architecture, consultez le fichier `PROJECT_STRUCTURE.md`.

## 📚 Développement

Pour ajouter de nouvelles fonctionnalités au chatbot :

1. Ajoutez des phrases d'exemple et l'intention associée dans `config/trainingData.js`
2. Créez un nouveau fichier de conversation dans le dossier `conversations/`
3. Ajoutez la gestion de cette nouvelle intention dans `conversationRouter.js`

## 📝 License

[MIT](LICENSE)
