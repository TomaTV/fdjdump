# Structure du Projet FDJDump

Ce document décrit la nouvelle architecture du projet FDJDump, qui a été restructuré pour organiser les conversations par fichier.

## Architecture des Fichiers

```
fdjdump/
│
├── chatbot.js                 # Point d'entrée principal
├── conversationRouter.js      # Gestionnaire de routage des conversations
├── config.js                  # Configuration générale
│
├── config/                    # Dossier de configuration
│   ├── db.js                  # Interactions avec la base de données
│   └── trainingData.js        # Données d'entraînement pour le NLP
│
├── conversations/             # Dossier contenant les modules de conversation
│   ├── accountCreation.js     # Conversation pour créer un compte
│   ├── balanceCheck.js        # Conversation pour consulter le solde
│   ├── cardManagement.js      # Conversations pour gérer les cartes
│   ├── login.js               # Conversation pour se connecter
│   ├── offers.js              # Conversations pour gérer les offres
│   ├── transactionHistory.js  # Conversation pour l'historique des transactions
│   ├── transfer.js            # Conversation pour effectuer un virement
│   └── withdraw.js            # Conversation pour effectuer un retrait
│
└── database.sql               # Schéma de la base de données
```

## Flux de Conversation

Chaque fichier dans le dossier `conversations/` représente un flux de conversation spécifique :

1. **accountCreation.js** : Guide l'utilisateur à travers le processus de création de compte, recueillant son prénom, nom, email, et le faisant choisir une offre.

2. **login.js** : Permet à l'utilisateur de se connecter via son email.

3. **balanceCheck.js** : Permet à l'utilisateur de consulter le solde de son compte via son IBAN.

4. **cardManagement.js** : Contient trois flux de conversation liés aux cartes :
   - Afficher les cartes associées à un IBAN
   - Recharger une carte
   - Supprimer une carte

5. **offers.js** : Gère deux flux liés aux offres bancaires :
   - Lister toutes les offres disponibles
   - Afficher les détails d'une offre spécifique

6. **transactionHistory.js** : Permet à l'utilisateur de consulter l'historique des transactions d'un compte.

7. **transfer.js** : Guide l'utilisateur à travers le processus de virement entre deux comptes.

8. **withdraw.js** : Permet à l'utilisateur d'effectuer un retrait sur son compte.

## Système de Routage

Le fichier `conversationRouter.js` sert de point central pour diriger les utilisateurs vers le bon flux de conversation en fonction de l'intention détectée par le système NLP.

## Comment Ajouter un Nouveau Flux de Conversation

Pour ajouter un nouveau flux de conversation :

1. Créez un nouveau fichier dans le dossier `conversations/` qui exporte une fonction principale.
2. La fonction doit accepter au minimum deux paramètres :
   - `rl` : L'interface readline pour interagir avec l'utilisateur
   - `callback` : Une fonction à appeler lorsque la conversation est terminée
3. Ajoutez l'intention correspondante dans `trainingData.js`
4. Ajoutez un nouveau cas dans le switch de `conversationRouter.js`
