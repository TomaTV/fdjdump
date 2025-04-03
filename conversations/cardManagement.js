const { getCardsByIban, rechargeCard, deleteCard } = require("../config/db");

function handleListCards(rl, callback) {
  console.log("\n=== Liste de vos cartes bancaires ===");
  
  rl.question("Veuillez saisir votre IBAN : ", (iban) => {
    getCardsByIban(iban, (err, cards) => {
      if (err) {
        console.error("Erreur lors de la récupération des cartes:", err);
        return callback();
      }
      
      if (cards.length === 0) {
        console.log("Aucune carte trouvée pour ce compte.");
      } else {
        console.log("\nVos cartes bancaires:");
        console.log("------------------------------------------");
        
        // En-tête du tableau
        console.log("| ID | Numéro | Type | Date d'expiration |");
        console.log("------------------------------------------");
        
        // Afficher chaque carte sous forme de tableau
        cards.forEach(card => {
          const expirationDate = new Date(card.expiration_date).toLocaleDateString();
          const maskedNumber = card.card_number.replace(/\d(?=\d{4})/g, "*");
          console.log(`| ${card.id} | ${maskedNumber} | ${card.card_type} | ${expirationDate} |`);
        });
        
        console.log("------------------------------------------");
      }
      
      // Proposer d'autres actions après la consultation
      askForMoreCardActions(rl, callback);
    });
  });
}

/**
 * Gère la recharge d'une carte
 * @param {Object} rl - Interface readline
 * @param {Function} callback - Fonction de rappel
 */
function handleRechargeCard(rl, callback) {
  console.log("\n=== Recharger une carte bancaire ===");
  
  rl.question("Numéro de la carte à recharger : ", (cardNumber) => {
    rl.question("Montant à recharger : ", (amount) => {
      const parsedAmount = parseFloat(amount);
      
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        console.log("Montant invalide. Veuillez saisir un nombre positif.");
        return callback();
      }
      
      rechargeCard(cardNumber, parsedAmount, (err, result) => {
        if (err) {
          console.error("Erreur lors de la recharge de la carte:", err);
          return callback();
        }
        
        console.log(result);
        askForMoreCardActions(rl, callback);
      });
    });
  });
}

/**
 * Gère la suppression d'une carte
 * @param {Object} rl - Interface readline
 * @param {Function} callback - Fonction de rappel
 */
function handleDeleteCard(rl, callback) {
  console.log("\n=== Supprimer une carte bancaire ===");
  
  rl.question("Numéro de la carte à supprimer : ", (cardNumber) => {
    rl.question("Êtes-vous sûr de vouloir supprimer cette carte ? (oui/non) : ", (confirm) => {
      if (confirm.toLowerCase() === 'oui') {
        deleteCard(cardNumber, (err, result) => {
          if (err) {
            console.error("Erreur lors de la suppression de la carte:", err);
            return callback();
          }
          
          console.log(result);
          askForMoreCardActions(rl, callback);
        });
      } else {
        console.log("Suppression annulée.");
        askForMoreCardActions(rl, callback);
      }
    });
  });
}

/**
 * Demande à l'utilisateur s'il souhaite effectuer d'autres opérations sur les cartes
 * @param {Object} rl - Interface readline
 * @param {Function} callback - Fonction de rappel
 */
function askForMoreCardActions(rl, callback) {
  rl.question("\nQue souhaitez-vous faire maintenant?\n1. Voir mes cartes\n2. Recharger une carte\n3. Supprimer une carte\n4. Retour au menu principal\nVotre choix : ", (choice) => {
    switch (choice) {
      case "1":
        handleListCards(rl, callback);
        break;
      case "2":
        handleRechargeCard(rl, callback);
        break;
      case "3":
        handleDeleteCard(rl, callback);
        break;
      case "4":
      default:
        callback();
        break;
    }
  });
}

module.exports = {
  handleListCards,
  handleRechargeCard,
  handleDeleteCard
};
