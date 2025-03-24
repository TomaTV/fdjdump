const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "FDJDump",
});

const query = (sql, values, callback) => {
  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error("Erreur SQL :", err);
      return callback(err);
    }
    callback(null, results);
  });
};

const formatBalance = (balance) => {
  return `${balance}€`;
};

const getBalance = (iban, callback) => {
  query("SELECT balance FROM accounts WHERE iban = ?", [iban], (err, results) => {
    callback(err, formatBalance(results[0]?.balance || 0));
  });
};

const getHistory = (iban, callback) => {
  query(
    `SELECT t.* FROM transactions t
     JOIN accounts a ON t.account_id = a.id
     WHERE a.iban = ?`,
    [iban],
    callback
  );
};

const withdrawMoney = (iban, amount, callback) => {
  query("UPDATE accounts SET balance = balance - ? WHERE iban = ?", [amount, iban], (err) => {
    if (err) return callback(err);
    query(
      `INSERT INTO transactions (account_id, action_type, amount) 
       VALUES ((SELECT id FROM accounts WHERE iban = ?), 'withdraw', ?)`,
      [iban, amount],
      (err) => {
        if (err) return callback(err);
        callback(null, `Retrait de ${amount}€ effectué avec succès.`);
      }
    );
  });
};

const transferMoney = (fromIban, toIban, amount, callback) => {
  pool.getConnection((err, connection) => {
    if (err) return callback(err);

    connection.beginTransaction((err) => {
      if (err) return callback(err);

      connection.query("UPDATE accounts SET balance = balance - ? WHERE iban = ?", [amount, fromIban], (err) => {
        if (err) return connection.rollback(() => callback(err));

        connection.query("UPDATE accounts SET balance = balance + ? WHERE iban = ?", [amount, toIban], (err) => {
          if (err) return connection.rollback(() => callback(err));

          connection.query(
            `INSERT INTO transactions (account_id, action_type, amount) 
             VALUES ((SELECT id FROM accounts WHERE iban = ?), 'transfer', ?)`,
            [fromIban, amount],
            (err) => {
              if (err) return connection.rollback(() => callback(err));

              connection.commit((err) => {
                if (err) return connection.rollback(() => callback(err));
                callback(null, `Virement de ${amount}€ effectué avec succès.`);
              });
            }
          );
        });
      });
    });
  });
};

const rechargeCard = (cardNumber, amount, callback) => {
  query(
    `UPDATE accounts 
     SET balance = balance + ? 
     WHERE id = (SELECT account_id FROM cards WHERE card_number = ?)`,
    [amount, cardNumber],
    (err) => {
      if (err) return callback(err);
      query(
        `INSERT INTO transactions (account_id, action_type, amount) 
         VALUES ((SELECT account_id FROM cards WHERE card_number = ?), 'recharge', ?)`,
        [cardNumber, amount],
        (err) => {
          if (err) return callback(err);
          callback(null, `Carte ${cardNumber} rechargée de ${amount}€`);
        }
      );
    }
  );
};

const getCardsByIban = (iban, callback) => {
  query(
    `SELECT c.* FROM cards c
     JOIN accounts a ON c.account_id = a.id
     WHERE a.iban = ?`,
    [iban],
    callback
  );
};

const deleteCard = (cardNumber, callback) => {
  query("DELETE FROM cards WHERE card_number = ?", [cardNumber], (err) => {
    if (err) return callback(err);
    callback(null, `Carte ${cardNumber} supprimée avec succès.`);
  });
};

const createAccount = (firstName, lastName, iban, balance, callback) => {
  query(
    `INSERT INTO clients (first_name, last_name) VALUES (?, ?)`,
    [firstName, lastName],
    (err, results) => {
      if (err) return callback(err);
      const clientId = results.insertId;

      query(
        `INSERT INTO accounts (client_id, iban, balance, account_type) 
         VALUES (?, ?, ?, 'checking')`,
        [clientId, iban, balance],
        (err) => {
          if (err) return callback(err);
          callback(null, `Compte créé avec succès pour ${firstName} ${lastName}.`);
        }
      );
    }
  );
};

const getOfferDetails = (offerId, callback) => {
  query("SELECT * FROM offers WHERE id = ?", [offerId], callback);
};

const getAllOffers = (callback) => {
  query("SELECT * FROM offers", [], callback);
};

const checkUserEmail = (email, callback) => {
  query(
    `SELECT c.id, c.first_name, c.last_name, c.email, c.offer_id, o.offer_name 
     FROM clients c
     JOIN offers o ON c.offer_id = o.id
     WHERE c.email = ?`,
    [email],
    (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) {
        return callback(null, { exists: false, message: "Utilisateur introuvable" });
      }
      return callback(null, { exists: true, user: results[0] });
    }
  );
};

const createUser = (firstName, lastName, email, offerId, callback) => {
  query(
    `INSERT INTO clients (first_name, last_name, email, offer_id) VALUES (?, ?, ?, ?)`,
    [firstName, lastName, email, offerId || 1],
    (err, results) => {
      if (err) return callback(err);
      const clientId = results.insertId;
      
      query(
        `SELECT c.id, c.first_name, c.last_name, c.email, c.offer_id, o.offer_name 
         FROM clients c
         JOIN offers o ON c.offer_id = o.id
         WHERE c.id = ?`,
        [clientId],
        (err, results) => {
          if (err) return callback(err);
          callback(null, { success: true, user: results[0] });
        }
      );
    }
  );
};

const deleteAccount = (iban, callback) => {
  query("DELETE FROM accounts WHERE iban = ?", [iban], (err) => {
    if (err) return callback(err);
    callback(null, `Compte ${iban} supprimé avec succès.`);
  });
};

module.exports = {
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
};
