const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "FDJDump",
});

const getBalance = (iban, callback) => {
  pool.query(
    "SELECT money FROM users WHERE iban = ?",
    [iban],
    (error, results) => {
      if (error) return callback(error);
      callback(null, results[0]?.money || 0);
    }
  );
};

const getHistory = (iban, callback) => {
  pool.query(
    `SELECT * FROM Transaction WHERE iban = ?`,
    [iban],
    (error, results) => {
      if (error) return callback(error);
      callback(null, results);
    }
  );
};

const getOfferDetails = (offerId, callback) => {
  pool.query(
    `SELECT * FROM Banque WHERE offer_id = ?`,
    [offerId],
    (error, results) => {
      if (error) return callback(error);
      callback(null, results[0]);
    }
  );
};

const withdrawMoney = (iban, amount, callback) => {
  pool.query(
    "UPDATE users SET money = money - ? WHERE iban = ?",
    [amount, iban],
    (error, results) => {
      if (error) return callback(error);
      pool.query(
        "INSERT INTO Historique (id_transaction, action_type, amount, action_date) VALUES (?, ?, ?, NOW())",
        [null, "withdraw", amount],
        (histError) => {
          if (histError) return callback(histError);
          callback(null, `Tu as retiré ${amount}€`);
        }
      );
    }
  );
};

const createAccount = (firstName, lastName, iban, money, callback) => {
  pool.query(
    "INSERT INTO users (first_name, last_name, iban, money) VALUES (?, ?, ?, ?)",
    [firstName, lastName, iban, money],
    (error, results) => {
      if (error) return callback(error);
      callback(null, "Compte créé avec succès");
    }
  );
};

module.exports = {
  pool,
  getBalance,
  getHistory,
  getOfferDetails,
  withdrawMoney,
  createAccount,
};
