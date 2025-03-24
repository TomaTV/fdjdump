const mysql = require("mysql2");
const fs = require("fs");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  multipleStatements: true,
});

const sqlScript = fs.readFileSync("./database.sql", "utf8");

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL :", err);
    return;
  }

  console.log("Connexion réussie à MySQL");

  connection.query(sqlScript, (error) => {
    if (error) {
      console.error("Erreur lors de l'exécution du script SQL :", error);
    } else {
      console.log("Base de données et données initiales créées avec succès.");
    }

    connection.end();
  });
});
