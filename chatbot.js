const limdu = require("limdu");
const trainingData = require("./config/trainingData");
const {
  getBalance,
  getHistory,
  withdrawMoney,
  transferMoney,
  rechargeCard,
  getCardsByIban,
  deleteCard,
  createAccount,
  getOfferDetails,
  deleteAccount,
  getAllOffers,
  checkUserEmail,
  createUser,
} = require("./config/db");
const readline = require("readline");

// Session utilisateur global
let userSession = null;

// Limdu classifier
const TextClassifier = limdu.classifiers.Bayesian;
const classifier = new limdu.classifiers.EnhancedClassifier({
  classifierType: TextClassifier,
  normalizer: limdu.features.LowerCaseNormalizer,
  featureExtractor: limdu.features.NGramsOfWords(1),
});

// Entraînement du chatbot
classifier.trainBatch(trainingData);

// Terminal Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getIntent(message) {
  return classifier.classify(message.toLowerCase());
}

// Fonction pour démarrer l'application
const startApp = () => {
  console.log("\n===== Bienvenue sur FDJDump - Votre Chatbot Bancaire =====\n");
  console.log("Êtes-vous déjà membre de notre banque ? (oui/non)\n");
  console.log("\u2022 Si oui, tapez 'se connecter'\n\u2022 Si non, tapez 'nouveau client'\n");
  askQuestion();
};

// Fonction pour afficher les informations de session
const displaySessionInfo = () => {
  if (userSession) {
    console.log(`\n====== Session Utilisateur ======`);
    console.log(`ID: ${userSession.id}`);
    console.log(`Nom: ${userSession.first_name} ${userSession.last_name}`);
    console.log(`Email: ${userSession.email}`);
    console.log(`Offre: ${userSession.offer_name}`);
    console.log(`==============================\n`);
  }
};

const askQuestion = () => {
  const prompt = userSession ? `\n[${userSession.first_name}] Que puis-je faire pour vous ? ` : "\nPose ta question : ";
  
  rl.question(prompt, (message) => {
    const intent = getIntent(message);

    // Si l'utilisateur est connecté, afficher des informations de session
    if (userSession) {
      displaySessionInfo();
    }
    
    switch (intent) {
      case "start":
        startApp();
        break;
        
      case "login":
        rl.question("Email : ", (email) => {
          checkUserEmail(email, (err, result) => {
            if (err) {
              console.error("Erreur lors de la vérification de l'email:", err);
              return askQuestion();
            }
            
            if (result.exists) {
              userSession = result.user;
              console.log(`\nBonjour ${userSession.first_name} ${userSession.last_name}! Vous êtes connecté.`);
            } else {
              console.log(result.message);
            }
            askQuestion();
          });
        });
        break;
        
      case "register":
        console.log("\nCréation d'un nouveau compte utilisateur:");
        rl.question("Prénom : ", (firstName) => {
          rl.question("Nom : ", (lastName) => {
            rl.question("Email : ", (email) => {
              getAllOffers((err, offers) => {
                if (err) {
                  console.error("Erreur lors de la récupération des offres:", err);
                  return askQuestion();
                }
                
                console.log("\nOffres disponibles:");
                offers.forEach(offer => {
                  console.log(`${offer.id}. ${offer.offer_name} - ${offer.offer_price}€ - ${offer.offer_details}`);
                });
                
                rl.question("\nChoisissez une offre (ID) : ", (offerId) => {
                  createUser(firstName, lastName, email, parseInt(offerId), (err, result) => {
                    if (err) {
                      console.error("Erreur lors de la création de l'utilisateur:", err);
                      return askQuestion();
                    }
                    
                    if (result.success) {
                      userSession = result.user;
                      console.log(`\nCompte créé avec succès! Bienvenue ${userSession.first_name}!`);
                    } else {
                      console.log("Erreur lors de la création du compte.");
                    }
                    askQuestion();
                  });
                });
              });
            });
          });
        });
        break;
        
      case "listOffers":
        getAllOffers((err, offers) => {
          if (err) {
            console.error("Erreur lors de la récupération des offres:", err);
            return askQuestion();
          }
          
          console.log("\nOffres disponibles:");
          offers.forEach(offer => {
            console.log(`${offer.id}. ${offer.offer_name} - ${offer.offer_price}€ - ${offer.offer_details}`);
          });
          askQuestion();
        });
        break;
        
      case "balance":
        rl.question("IBAN : ", (iban) => {
          getBalance(iban, handleResponse);
        });
        break;

      case "history":
        rl.question("IBAN : ", (iban) => {
          getHistory(iban, handleResponse);
        });
        break;

      case "withdraw":
        rl.question("IBAN : ", (iban) => {
          rl.question("Montant à retirer : ", (amount) => {
            withdrawMoney(iban, parseFloat(amount), handleResponse);
          });
        });
        break;

      case "transfer":
        rl.question("IBAN source : ", (fromIban) => {
          rl.question("IBAN destination : ", (toIban) => {
            rl.question("Montant : ", (amount) => {
              transferMoney(fromIban, toIban, parseFloat(amount), handleResponse);
            });
          });
        });
        break;

      case "rechargeCard":
        rl.question("Numéro de carte : ", (cardNumber) => {
          rl.question("Montant : ", (amount) => {
            rechargeCard(cardNumber, parseFloat(amount), handleResponse);
          });
        });
        break;

      case "getCards":
        rl.question("IBAN : ", (iban) => {
          getCardsByIban(iban, handleResponse);
        });
        break;

      case "deleteCard":
        rl.question("Numéro de carte : ", (cardNumber) => {
          deleteCard(cardNumber, handleResponse);
        });
        break;

      case "createAccount":
        console.log("Création de compte :");
        rl.question("Prénom : ", (firstName) => {
          rl.question("Nom : ", (lastName) => {
            rl.question("IBAN : ", (iban) => {
              rl.question("Montant initial : ", (money) => {
                createAccount(firstName, lastName, iban, parseFloat(money), handleResponse);
              });
            });
          });
        });
        break;

      case "offerDetails":
        rl.question("ID de l'offre : ", (offerId) => {
          getOfferDetails(offerId, handleResponse);
        });
        break;

      case "deleteAccount":
        rl.question("IBAN à supprimer : ", (iban) => {
          deleteAccount(iban, handleResponse);
        });
        break;

      default:
        console.log("Je n'ai pas compris.");
        askQuestion();
    }
  });
};

// Fonction pour gérer la réponse du serveur
const handleResponse = (err, result) => {
  if (err) {
    console.error("Erreur serveur :", err);
  } else {
    console.log(result);
  }
  askQuestion();
};

// Démarrer le chatbot avec un message d'accueil
console.log("\n===== Bienvenue sur FDJDump - Votre Chatbot Bancaire =====\n");

askQuestion();
