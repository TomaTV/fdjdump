const handleAccountCreation = require("./conversations/accountCreation");
const handleLogin = require("./conversations/login");
const handleBalanceCheck = require("./conversations/balanceCheck");
const handleTransfer = require("./conversations/transfer");
const handleTransactionHistory = require("./conversations/transactionHistory");
const { handleListCards, handleRechargeCard, handleDeleteCard } = require("./conversations/cardManagement");
const { handleListOffers, handleOfferDetails } = require("./conversations/offers");
const handleWithdraw = require("./conversations/withdraw");

function routeConversation(intent, rl, userSession, callback) {
  switch (intent) {
    // Intentions liées à l'authentification
    case "register":
      handleAccountCreation(rl, (newUserSession) => {
        callback(newUserSession);
      });
      break;
      
    case "login":
      handleLogin(rl, (newUserSession) => {
        callback(newUserSession);
      });
      break;
    
    // Intentions liées aux opérations bancaires
    case "balance":
      handleBalanceCheck(rl, userSession, () => {
        callback(userSession);
      });
      break;
      
    case "transfer":
      handleTransfer(rl, userSession, () => {
        callback(userSession);
      });
      break;
      
    case "history":
      handleTransactionHistory(rl, userSession, () => {
        callback(userSession);
      });
      break;
      
    case "withdraw":
      handleWithdraw(rl, userSession, () => {
        callback(userSession);
      });
      break;
    
    // Intentions liées aux cartes bancaires
    case "getCards":
      handleListCards(rl, () => {
        callback(userSession);
      });
      break;
      
    case "rechargeCard":
      handleRechargeCard(rl, () => {
        callback(userSession);
      });
      break;
      
    case "deleteCard":
      handleDeleteCard(rl, () => {
        callback(userSession);
      });
      break;
    
    // Intentions liées aux offres
    case "listOffers":
      handleListOffers(rl, userSession, () => {
        callback(userSession);
      });
      break;
      
    case "offerDetails":
      // Cette intention nécessiterait d'abord de demander quel offerId consulter
      rl.question("ID de l'offre à consulter : ", (offerId) => {
        handleOfferDetails(rl, parseInt(offerId), () => {
          callback(userSession);
        });
      });
      break;
    
    // Intention non reconnue
    default:
      console.log("Je n'ai pas compris votre demande.");
      callback(userSession);
      break;
  }
}

module.exports = routeConversation;
