const { createUser, getAllOffers } = require("../config/db");

function handleAccountCreation(rl, callback) {
  console.log("\n=== Création d'un nouveau compte utilisateur ===");
  
  let userData = {
    firstName: "",
    lastName: "",
    email: "",
    offerId: null
  };

  // Étape 1: Collecter le prénom
  rl.question("Prénom : ", (firstName) => {
    userData.firstName = firstName;
    
    // Étape 2: Collecter le nom
    rl.question("Nom : ", (lastName) => {
      userData.lastName = lastName;
      
      // Étape 3: Collecter l'email
      rl.question("Email : ", (email) => {
        userData.email = email;
        
        // Étape 4: Afficher et sélectionner une offre
        getAllOffers((err, offers) => {
          if (err) {
            console.error("Erreur lors de la récupération des offres:", err);
            return callback(null);
          }
          
          console.log("\nOffres disponibles:");
          offers.forEach(offer => {
            console.log(`${offer.id}. ${offer.offer_name} - ${offer.offer_price}€ - ${offer.offer_details}`);
          });
          
          // Étape 5: Sélectionner l'offre
          rl.question("\nChoisissez une offre (ID) : ", (offerId) => {
            userData.offerId = parseInt(offerId);
            
            // Étape finale: Créer l'utilisateur dans la base de données
            createUser(
              userData.firstName, 
              userData.lastName, 
              userData.email, 
              userData.offerId, 
              (err, result) => {
                if (err) {
                  console.error("Erreur lors de la création de l'utilisateur:", err);
                  return callback(null);
                }
                
                if (result.success) {
                  console.log(`\nCompte créé avec succès! Bienvenue ${result.user.first_name}!`);
                  // Retourner la session utilisateur créée
                  callback(result.user);
                } else {
                  console.log("Erreur lors de la création du compte.");
                  callback(null);
                }
              }
            );
          });
        });
      });
    });
  });
}

module.exports = handleAccountCreation;
