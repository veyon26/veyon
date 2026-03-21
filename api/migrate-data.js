require("dotenv").config();
const mysql = require("mysql2/promise");

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

async function seedData() {
  const db = await getConnection();

  // Customers default data
//   await db.execute(`
//     INSERT IGNORE INTO customers (name, email, phone, address) VALUES
//     ('John Doe', 'john@example.com', '9876543210', '123 Main St, Chennai'),
//     ('Jane Smith', 'jane@example.com', '9876543211', '456 Park Ave, Mumbai'),
//     ('Raj Kumar', 'raj@example.com', '9876543212', '789 Lake Rd, Delhi')
//   `);


  console.log("\n All default data inserted successfully!");
  await db.end();
}

seedData().catch(console.error);