"use strict";

exports.up = function (db, callback) {
  const sql = `
   CREATE TABLE billing (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_no VARCHAR(20) NOT NULL UNIQUE,
  invoice_date DATE,
  transport VARCHAR(100),
  lr_no VARCHAR(50),              
  order_no VARCHAR(50),
  order_date DATE,
  freight DECIMAL(10,2),
  no_of_packages INT,
  agent_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `;

  db.runSql(sql, callback);
};

exports.down = function (db, callback) {
  const sql = `DROP TABLE countries;`;
  db.runSql(sql, callback);
};

exports._meta = {
  version: 1,
};
