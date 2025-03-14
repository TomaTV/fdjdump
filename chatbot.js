const limdu = require("limdu");
const {
  getBalance,
  getHistory,
  getOfferDetails,
  withdrawMoney,
  createAccount,
} = require("./config/db");
const readline = require("readline");

// Limdu classifier with more options for better NLP
const TextClassifier = limdu.classifiers.Bayesian;
const classifier = new limdu.classifiers.EnhancedClassifier({
  classifierType: TextClassifier,
  normalizer: limdu.features.LowerCaseNormalizer,
  // Add a simple tokenizer to improve text analysis
  featureExtractor: limdu.features.NGramsOfWords(1),
});

// Expanded training data with more variations
let trainingData = [
  { input: "solde de mon compte", output: "balance" },

  { input: "historique de mes transactions", output: "history" },

  { input: "je veux retirer de l'argent", output: "withdraw" },

  { input: "créer un compte", output: "createAccount" },
];

// Train the classifier
classifier.trainBatch(trainingData);

// Terminal interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Get the user's intent from their message
function getIntent(message) {
  // Prepare the message with the same format as the training data
  const processedMessage = message.toLowerCase();
  // Return the classified intent
  return classifier.classify(processedMessage);
}

const askQuestion = () => {
  rl.question("\nPose ta question : ", (message) => {
    // Identifier l'intention de l'utilisateur
    const intent = getIntent(message);

    switch (intent) {
      case "balance":
        rl.question("Entre ton IBAN : ", (iban) => {
          getBalance(iban, (err, balance) => {
            if (err) console.error("Erreur serveur", err);
            else console.log(`Votre solde est de ${balance}€`);
            askQuestion();
          });
        });
        break;

      case "history":
        rl.question("Entre ton IBAN : ", (iban) => {
          getHistory(iban, (err, history) => {
            if (err) console.error("Erreur serveur", err);
            else console.log(history);
            askQuestion();
          });
        });
        break;

      case "offer":
        rl.question("ID de l'offre : ", (offerId) => {
          getOfferDetails(offerId, (err, offer) => {
            if (err) console.error("Erreur serveur", err);
            else console.log(offer);
            askQuestion();
          });
        });
        break;

      case "withdraw":
        rl.question("Ton IBAN : ", (iban) => {
          rl.question("Montant à retirer : ", (amount) => {
            withdrawMoney(iban, parseFloat(amount), (err, message) => {
              if (err) console.error("Erreur serveur", err);
              else console.log(message);
              askQuestion();
            });
          });
        });
        break;

      case "createAccount":
        console.log("Création d'un nouveau compte :");
        rl.question("Prénom : ", (firstName) => {
          rl.question("Nom : ", (lastName) => {
            rl.question("IBAN : ", (iban) => {
              rl.question("Montant initial : ", (money) => {
                createAccount(
                  firstName,
                  lastName,
                  iban,
                  parseFloat(money),
                  (err, message) => {
                    if (err) console.error("Erreur serveur", err);
                    else console.log(message);
                    askQuestion();
                  }
                );
              });
            });
          });
        });
        break;

      default:
        console.log(
          "Je n'ai pas compris votre demande. Pouvez-vous reformuler ?"
        );
        askQuestion();
    }
  });
};
askQuestion();
