const { transferMoney, getBalance } = require("../config/db");

function handleTransfer(rl, userSession, callback) {
  console.log("\n=== Effectuer un virement bancaire ===");
  
  let transferData = {
    fromIban: "",
    toIban: "",
    amount: 0,
    description: ""
  };

  // Étape 1: IBAN source
  rl.question("IBAN source : ", (fromIban) => {
    transferData.fromIban = fromIban;
    
    // Vérifier le solde disponible
    getBalance(fromIban, (err, balance) => {
      if (err) {
        console.error("Erreur lors de la vérification du solde:", err);
        return callback();
      }
      
      console.log(`Solde disponible: ${balance}`);
      
      // Étape 2: IBAN destination
      rl.question("IBAN destination : ", (toIban) => {
        transferData.toIban = toIban;
        
        // Étape 3: Montant
        rl.question("Montant à transférer : ", (amount) => {
          transferData.amount = parseFloat(amount);
          
          // Étape 4: Description/motif
          rl.question("Motif du virement (optionnel) : ", (description) => {
            transferData.description = description;
            
            // Étape 5: Confirmation
            console.log("\nRécapitulatif du virement:");
            console.log(`De: ${transferData.fromIban}`);
            console.log(`Vers: ${transferData.toIban}`);
            console.log(`Montant: ${transferData.amount}€`);
            console.log(`Motif: ${transferData.description || "Non spécifié"}`);
            
            rl.question("\nConfirmez-vous ce virement ? (oui/non) : ", (confirm) => {
              if (confirm.toLowerCase() === 'oui') {
                // Exécuter le virement
                transferMoney(
                  transferData.fromIban, 
                  transferData.toIban, 
                  transferData.amount, 
                  (err, result) => {
                    if (err) {
                      console.error("Erreur lors du virement:", err);
                      return callback();
                    }
                    
                    console.log(result);
                    
                    // Demander si l'utilisateur veut faire une autre opération
                    rl.question("\nSouhaitez-vous effectuer une autre opération ? (oui/non) : ", (another) => {
                      if (another.toLowerCase() === 'oui') {
                        callback();
                      } else {
                        console.log("Merci d'avoir utilisé notre service. À bientôt !");
                        callback();
                      }
                    });
                  }
                );
              } else {
                console.log("Virement annulé.");
                callback();
              }
            });
          });
        });
      });
    });
  });
}

module.exports = handleTransfer;
