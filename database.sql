CREATE DATABASE FDJDump;

USE FDJDump;

CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  iban VARCHAR(34) UNIQUE NOT NULL,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  account_type ENUM('savings', 'checking', 'business') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  account_id INT,
  card_number VARCHAR(16) UNIQUE,
  card_type ENUM('virtual', 'physical'),
  expiration_date DATE,
  cvv VARCHAR(4),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT,
  action_type ENUM('deposit', 'withdraw', 'transfer') NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Insert sample clients
INSERT INTO clients (first_name, last_name, email, phone, address) VALUES
('Thomas', 'Dupont', 'thomas@example.com', '0612345678', '12 rue de Paris'),
('Alice', 'Martin', 'alice@example.com', '0623456789', '34 avenue de Lyon'),
('John', 'Doe', 'john@example.com', '0634567890', '56 boulevard de Marseille');

-- Insert sample accounts
INSERT INTO accounts (client_id, iban, balance, account_type) VALUES
(1, 'FR7630004000031234567890185', 500.00, 'checking'),
(2, 'FR7630004000039876543210123', 1000.00, 'savings'),
(3, 'FR763000400003111122223333', 200.00, 'business');

-- Insert sample cards
INSERT INTO cards (client_id, account_id, card_number, card_type, expiration_date, cvv) VALUES
(1, 1, '1111222233334444', 'physical', '2026-05-15', '123'),
(2, 2, '5555666677778888', 'virtual', '2027-10-10', '456'),
(3, 3, '9999000011112222', 'physical', '2025-12-01', '789');

-- Insert sample transactions
INSERT INTO transactions (account_id, action_type, amount) VALUES
(1, 'deposit', 200.00),
(2, 'withdraw', 150.00),
(3, 'transfer', 50.00);

-- Create offers table
CREATE TABLE offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offer_name VARCHAR(100) NOT NULL,
  offer_details TEXT,
  offer_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample offers
INSERT INTO offers (offer_name, offer_details, offer_price) VALUES
('Offre Standard', 'Compte bancaire standard avec une carte de débit et des opérations bancaires de base', 0.00),
('Offre Premium', 'Compte bancaire premium avec une carte Gold et des avantages supplémentaires', 9.99),
('Offre Business', 'Compte bancaire pour les entreprises avec des fonctionnalités adaptées aux besoins professionnels', 19.99);

-- Add offer_id to clients table
ALTER TABLE clients ADD COLUMN offer_id INT DEFAULT 1;
ALTER TABLE clients ADD FOREIGN KEY (offer_id) REFERENCES offers(id);

-- Update existing clients with default offer
UPDATE clients SET offer_id = 1;