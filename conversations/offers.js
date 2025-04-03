const { getAllOffers, getOfferDetails } = require("../config/db");

function handleListOffers(rl, userSession, callback) {
  console.log("\n=== Liste des offres bancaires ===");
  
  getAllOffers((err, offers) => {
    if (err) {
      console.error("Erreur lors de la récupération des offres:", err);
      return callback();
    }
    
    if (offers.length === 0) {
      console.log("Aucune offre disponible actuellement.");
    } else {
      console.log("\nOffres disponibles:");
      console.log("------------------------------------------");
      
      // Afficher chaque offre
      offers.forEach(offer => {
        console.log(`ID: ${offer.id}`);
        console.log(`Nom: ${offer.offer_name}`);
        console.log(`Prix: ${offer.offer_price}€`);
        console.log(`Description: ${offer.offer_details}`);
        console.log("------------------------------------------");
      });
    }
    
    // Demander si l'utilisateur veut voir les détails d'une offre spécifique
    rl.question("\nSouhaitez-vous voir les détails d'une offre spécifique? (ID de l'offre ou 'non') : ", (answer) => {
      if (answer.toLowerCase() === 'non') {
        callback();
      } else {
        handleOfferDetails(rl, parseInt(answer), callback);
      }
    });
  });
}

/**
 * Affiche les détails d'une offre spécifique
 * @param {Object} rl - Interface readline
 * @param {number} offerId - ID de l'offre à consulter
 * @param {Function} callback - Fonction de rappel
 */
function handleOfferDetails(rl, offerId, callback) {
  getOfferDetails(offerId, (err, offerDetails) => {
    if (err) {
      console.error("Erreur lors de la récupération des détails de l'offre:", err);
      return callback();
    }
    
    if (!offerDetails || offerDetails.length === 0) {
      console.log(`Aucune offre trouvée avec l'ID ${offerId}.`);
    } else {
      const offer = offerDetails[0];
      
      console.log("\n=== Détails de l'offre ===");
      console.log(`ID: ${offer.id}`);
      console.log(`Nom: ${offer.offer_name}`);
      console.log(`Prix: ${offer.offer_price}€`);
      console.log(`Description: ${offer.offer_details}`);
      console.log(`Date de création: ${new Date(offer.created_at).toLocaleString()}`);
      
      // Ici on pourrait ajouter des avantages spécifiques à l'offre, etc.
    }
    
    // Retour au menu des offres ou au menu principal
    rl.question("\nSouhaitez-vous consulter une autre offre? (oui/non) : ", (answer) => {
      if (answer.toLowerCase() === 'oui') {
        handleListOffers(rl, null, callback);
      } else {
        callback();
      }
    });
  });
}

module.exports = {
  handleListOffers,
  handleOfferDetails
};
