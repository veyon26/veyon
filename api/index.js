const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/db");
const PORT = 4000;

app.use(cors());
app.use(express.json());

const billing = require("./router/Billing");

app.use("/api", billing);

app.listen(PORT, () => {
  console.log(`RUNNING API ${PORT}`);
});
