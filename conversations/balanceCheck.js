const { getBalance } = require("../config/db");

function handleBalanceCheck(rl, userSession, callback) {
  console.log("\n=== Consultation de solde ===");
  
  // Si on a déjà les comptes de l'utilisateur dans la session, on pourrait proposer une liste
  rl.question("Veuillez saisir votre IBAN : ", (iban) => {
    getBalance(iban, (err, balance) => {
      if (err) {
        console.error("Erreur lors de la récupération du solde:", err);
        return callback();
      }
      
      console.log(`\nSolde actuel du compte ${iban}: ${balance}`);
      
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

module.exports = handleBalanceCheck;
