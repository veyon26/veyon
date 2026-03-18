const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Vicky@12345",
  database: "veyon",
});

db.getConnection((err) => {
  if (err) {
    console.log("db connection error", err);
  } else {
    console.log("db connected succesfully!");
  }
});

const dbpromise = db.promise();

module.exports = dbpromise;
