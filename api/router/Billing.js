const router = require("express").Router();
const db = require("../config/db");

router.get("/generate-billno", async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT id FROM billing ORDER BY id DESC LIMIT 1",
    );

    let nextNumber = 1;

    if (result.length > 0) {
      nextNumber = result[0].id + 1;
    }

    const newInvoiceNo = `${String(nextNumber).padStart(2, "0")}`;

    res.send({ invoice_no: newInvoiceNo });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/billing", async (req, res) => {
  try {
    const [response] = await db.query("SELECT * FROM billing");
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "get billing is error", error });
  }
});
module.exports = router;
