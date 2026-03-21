require("dotenv").config();
const mysql = require("mysql2/promise");
const { execSync } = require("child_process");

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

async function up() {
  const db = await getConnection();

  // 1. Billing Table
  await db.execute(`
    CREATE TABLE billing (
      id INT AUTO_INCREMENT PRIMARY KEY,
      invoice_no VARCHAR(20) NOT NULL UNIQUE,
      invoice_date DATE DEFAULT NULL,
      transport VARCHAR(100) DEFAULT NULL,
      lr_no VARCHAR(50) DEFAULT NULL,
      order_no VARCHAR(50) DEFAULT NULL,
      order_date DATE DEFAULT NULL,
      freight DECIMAL(10,2) DEFAULT NULL,
      no_of_packages INT DEFAULT NULL,
      agent_name VARCHAR(100) DEFAULT NULL,
      customer_name_or_shop_name VARCHAR(100) DEFAULT NULL,
      address TEXT DEFAULT NULL,
      phone_no VARCHAR (20) DEFAULT NULL,
      gstin_no VARCHAR (100) DEFAULT NULL,
      state_code VARCHAR (10) DEFAULT NULL,
      cgst DECIMAL (5,2) DEFAULT NULL,
      sgst DECIMAL (5,2) DEFAULT NULL,
      igst DECIMAL (5,2) DEFAULT NULL,
      round_off DECIMAL(10,2) DEFAULT NULL,
      bank_name VARCHAR(100) DEFAULT NULL,
      account_no VARCHAR(30) DEFAULT NULL,
      ifsc_code VARCHAR(15) DEFAULT NULL,
      account_holder_name VARCHAR(100) DEFAULT NULL,
      is_deleted tinyint(1) NOT NULL DEFAULT '0',
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Product Details
   await db.execute(`
    CREATE TABLE product_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hsn VARCHAR(250) DEFAULT NULL,
    desgn_no VARCHAR(250) DEFAULT NULL,
    goods VARCHAR(250) DEFAULT NULL,
    qty VARCHAR(250) DEFAULT NULL,
    rate VARCHAR(250) DEFAULT NULL,
    billing_id INT NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- KEY CONSTRAINTS --
    CONSTRAINT fk_status_billing_id FOREIGN KEY (billing_id) REFERENCES billing (id)
    )
    `) 

  console.log("\n All tables created successfully!");
  await db.end();

  // Auto seed default data
  console.log("\n Inserting default data...\n");
  execSync("node migrate-data.js", { stdio: "inherit" });
}

async function down() {
    const db = await getConnection();
  try {
    await db.execute('DROP TABLE IF EXISTS product_items');
    
    await db.execute('DROP TABLE IF EXISTS billing');

    console.log("Tables dropped successfully");
  } catch (error) {
    console.error("Drop table error:", error);
  }
}

// Command line argument check
const command = process.argv[2];

if (command === "up") {
  up().catch(console.error);
} else if (command === "down") {
  down().catch(console.error);
} else {
  console.log("Usage:");
  console.log(
    "  node migrate.js up   → Create all tables + insert default data",
  );
  console.log("  node migrate.js down → Drop all tables");
}
