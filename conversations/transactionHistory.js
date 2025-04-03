const { getHistory } = require("../config/db");

function handleTransactionHistory(rl, userSession, callback) {
  console.log("\n=== Historique des transactions ===");
  
  rl.question("Veuillez saisir votre IBAN : ", (iban) => {
    getHistory(iban, (err, transactions) => {
      if (err) {
        console.error("Erreur lors de la récupération de l'historique:", err);
        return callback();
      }
      
      if (transactions.length === 0) {
        console.log("Aucune transaction trouvée pour ce compte.");
      } else {
        console.log("\nHistorique des transactions:");
        console.log("------------------------------------------");
        
        // En-tête du tableau
        console.log("| ID | Type | Montant | Date |");
        console.log("------------------------------------------");
        
        // Afficher chaque transaction sous forme de tableau
        transactions.forEach(transaction => {
          const date = new Date(transaction.action_date).toLocaleString();
          console.log(`| ${transaction.id} | ${transaction.action_type} | ${transaction.amount}€ | ${date} |`);
        });
        
        console.log("------------------------------------------");
      }
      
      // Proposer d'autres actions après la consultation
      rl.question("\nSouhaitez-vous effectuer une autre opération ? (oui/non) : ", (answer) => {
        if (answer.toLowerCase() === 'oui') {
          callback();
        } else {
          console.log("Merci d'avoir utilisé notre service. À bientôt !");
          callback();
        }
      });
    });
  });
}

module.exports = handleTransactionHistory;
