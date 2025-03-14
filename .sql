CREATE DATABASE FDJDump;

USE FDJDump;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  iban VARCHAR(34) UNIQUE,
  money DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE transaction (
  id_transaction INT AUTO_INCREMENT PRIMARY KEY,
  id INT,
  iban VARCHAR(34),
  withdraw_money DECIMAL(10,2),
  deposit_money DECIMAL(10,2),
  money DECIMAL(10,2),
  FOREIGN KEY (id) REFERENCES users(id)
);

CREATE TABLE historique (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_transaction INT,
  action_type VARCHAR(50),
  amount DECIMAL(10,2),
  action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_transaction) REFERENCES transaction(id_transaction)
);

CREATE TABLE banque (
  offer_id INT AUTO_INCREMENT PRIMARY KEY,
  offer VARCHAR(100),
  details TEXT,
  price DECIMAL(10,2)
);
