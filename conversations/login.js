const { checkUserEmail } = require("../config/db");

function handleLogin(rl, callback) {
  console.log("\n=== Connexion à votre compte ===");
  
  rl.question("Email : ", (email) => {
    checkUserEmail(email, (err, result) => {
      if (err) {
        console.error("Erreur lors de la vérification de l'email:", err);
        return callback(null);
      }
      
      if (result.exists) {
        console.log(`\nBonjour ${result.user.first_name} ${result.user.last_name}! Vous êtes connecté.`);
        callback(result.user);
      } else {
        console.log(result.message || "Utilisateur introuvable. Veuillez vérifier votre email ou créer un compte.");
        callback(null);
      }
    });
  });
}

module.exports = handleLogin;
