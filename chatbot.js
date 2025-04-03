const limdu = require("limdu");
const trainingData = require("./config/trainingData");
const readline = require("readline");
const routeConversation = require("./conversationRouter");

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

const startApp = () => {
  console.log("\n===== Bienvenue sur FDJDump - Votre Chatbot Bancaire =====\n");
  console.log("Êtes-vous déjà membre de notre banque ? (oui/non)\n");
  console.log("\u2022 Si oui, tapez 'se connecter'\n\u2022 Si non, tapez 'nouveau client'\n");
  askQuestion();
};

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
  const prompt = userSession 
    ? `\n[${userSession.first_name}] Que puis-je faire pour vous ? ` 
    : "\nPose ta question : ";
  
  rl.question(prompt, (message) => {
    const intent = getIntent(message);

    // Si l'utilisateur est connecté, afficher des informations de session
    if (userSession) {
      displaySessionInfo();
    }
    
    // Cas spécial pour l'intention "start"
    if (intent === "start") {
      startApp();
    } else {
      // Router la conversation en fonction de l'intention
      routeConversation(intent, rl, userSession, (updatedSession) => {
        // Mettre à jour la session utilisateur si nécessaire
        if (updatedSession) {
          userSession = updatedSession;
        }
        
        // Continuer la conversation
        askQuestion();
      });
    }
  });
};

const exitApp = () => {
  console.log("\nMerci d'avoir utilisé FDJDump. À bientôt !\n");
  rl.close();
  process.exit(0);
};

rl.on('line', (line) => {
  if (line.toLowerCase() === 'exit' || line.toLowerCase() === 'quit') {
    exitApp();
  }
});

console.log("\n===== Bienvenue sur FDJDump - Votre Chatbot Bancaire =====\n");
console.log("Pour quitter à tout moment, tapez 'exit' ou 'quit'");
askQuestion();
