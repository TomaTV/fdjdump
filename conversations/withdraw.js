const { withdrawMoney, getBalance } = require("../config/db");

function handleWithdraw(rl, userSession, callback) {
  console.log("\n=== Effectuer un retrait d'argent ===");
  
  rl.question("Veuillez saisir votre IBAN : ", (iban) => {
    // Vérifier d'abord le solde disponible
    getBalance(iban, (err, balance) => {
      if (err) {
        console.error("Erreur lors de la vérification du solde:", err);
        return callback();
      }
      
      console.log(`Solde disponible: ${balance}`);
      
      // Demander le montant à retirer
      rl.question("Montant à retirer : ", (amount) => {
        const withdrawAmount = parseFloat(amount);
        
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
          console.log("Montant invalide. Veuillez saisir un nombre positif.");
          return callback();
        }
        
        // Confirmation du retrait
        rl.question(`Confirmez-vous le retrait de ${withdrawAmount}€ ? (oui/non) : `, (confirm) => {
          if (confirm.toLowerCase() === 'oui') {
            // Exécuter le retrait
            withdrawMoney(iban, withdrawAmount, (err, result) => {
              if (err) {
                console.error("Erreur lors du retrait:", err);
                return callback();
              }
              
              console.log(result);
              
              // Afficher le nouveau solde
              getBalance(iban, (err, newBalance) => {
                if (!err) {
                  console.log(`Nouveau solde: ${newBalance}`);
                }
                
                // Demander si l'utilisateur veut faire une autre opération
                rl.question("\nSouhaitez-vous effectuer une autre opération ? (oui/non) : ", (another) => {
                  if (another.toLowerCase() === 'oui') {
                    callback();
                  } else {
                    console.log("Merci d'avoir utilisé notre service. À bientôt !");
                    callback();
                  }
                });
              });
            });
          } else {
            console.log("Retrait annulé.");
            callback();
          }
        });
      });
    });
  });
}

module.exports = handleWithdraw;
