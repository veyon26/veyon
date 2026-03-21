const router = require("express").Router();
const db = require("../config/db");

router.get("/generate-billno", async (req, res) => {
  try {
    const [result] = await db.query(
      `SELECT id FROM billing ORDER BY id DESC LIMIT 1`,
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
    const [response] = await db.query(`SELECT b.*, JSON_ARRAYAGG(
        JSON_OBJECT(
        'id',pi.id,
        'hsn', pi.hsn,
        'hsn', pi.hsn,
        'desgn_no', pi.desgn_no,
        'goods', pi.goods,
        'qty', pi.qty,
        'rate', pi.rate)) AS product_items
         FROM billing b LEFT JOIN product_items pi ON b.id = pi.billing_id
      WHERE b.is_deleted = 0 GROUP BY b.id `);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "get billing is error", error });
  }
});

router.post("/billing", async (req, res) => {
  try {
    const {
      invoice_no,
      invoice_date,
      transport,
      lr_no,
      order_no,
      order_date,
      freight,
      no_of_packages,
      agent_name,
      customer_name_or_shop_name,
      address,
      phone_no,
      gstin_no,
      state_code,
      cgst,
      sgst,
      igst,
      round_off,
      bank_name,
      account_no,
      ifsc_code,
      account_holder_name,
      product_items,
    } = req.body;

    const billingQuery = `
      INSERT INTO billing (
        invoice_no,invoice_date, transport, lr_no, order_no, order_date,
        freight, no_of_packages, agent_name, customer_name_or_shop_name,
        address, phone_no, gstin_no, state_code, cgst, sgst, igst,
        round_off, bank_name, account_no, ifsc_code, account_holder_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const billingValues = [
      invoice_no,
      invoice_date,
      transport,
      lr_no,
      order_no,
      order_date,
      freight,
      no_of_packages,
      agent_name,
      customer_name_or_shop_name,
      address,
      phone_no,
      gstin_no,
      state_code,
      cgst,
      sgst,
      igst,
      round_off,
      bank_name,
      account_no,
      ifsc_code,
      account_holder_name,
    ];

    const [billingResult] = await db.query(billingQuery, billingValues);
    const billingId = billingResult.insertId;

    const productQuery = `
  INSERT INTO product_items (hsn, desgn_no, goods, qty, rate, billing_id) VALUES ?
`;

    const productValues = product_items.map((item) => [
      item.hsn,
      item.desgn_no,
      item.goods,
      item.qty,
      item.rate,
      billingId,
    ]);

    await db.query(productQuery, [productValues]);

    res.status(200).json({ message: "Billing data is saved" });
  } catch (error) {
    res.status(500).json({ message: "post data is error", error });
  }
});

router.put("/billing/:id", async (req, res) => {
  try {
    const billingId = req.params.id;

    const {
      invoice_no,
      invoice_date,
      transport,
      lr_no,
      order_no,
      order_date,
      freight,
      no_of_packages,
      agent_name,
      customer_name_or_shop_name,
      address,
      phone_no,
      gstin_no,
      state_code,
      cgst,
      sgst,
      igst,
      round_off,
      bank_name,
      account_no,
      ifsc_code,
      account_holder_name,
      product_items,
    } = req.body;

    // Update billing
    const updateBillingQuery = `
      UPDATE billing SET
        invoice_no = ?,
        invoice_date = ?, transport = ?, lr_no = ?, order_no = ?, order_date = ?,
        freight = ?, no_of_packages = ?, agent_name = ?, customer_name_or_shop_name = ?,
        address = ?, phone_no = ?, gstin_no = ?, state_code = ?, cgst = ?, sgst = ?, igst = ?,
        round_off = ?, bank_name = ?, account_no = ?, ifsc_code = ?, account_holder_name = ?
      WHERE id = ?
    `;

    const updateValues = [
      invoice_no,
      invoice_date,
      transport,
      lr_no,
      order_no,
      order_date,
      freight,
      no_of_packages,
      agent_name,
      customer_name_or_shop_name,
      address,
      phone_no,
      gstin_no,
      state_code,
      cgst,
      sgst,
      igst,
      round_off,
      bank_name,
      account_no,
      ifsc_code,
      account_holder_name,
      billingId,
    ];

    await db.query(updateBillingQuery, updateValues);

    if (product_items && product_items.length > 0) {
      for (const item of product_items) {
        if (item.id) {
          //  UPDATE existing product
          await db.query(
            `UPDATE product_items SET
         hsn = ?, desgn_no = ?, goods = ?, qty = ?, rate = ?
         WHERE id = ?`,
            [item.hsn, item.desgn_no, item.goods, item.qty, item.rate, item.id],
          );
        } else {
          // INSERT new product
          await db.query(
            `INSERT INTO product_items
         (hsn, desgn_no, goods, qty, rate, billing_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
            [
              item.hsn,
              item.desgn_no,
              item.goods,
              item.qty,
              item.rate,
              billingId,
            ],
          );
        }
      }
    }

    res.status(200).json({ message: "Billing updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Update error", error });
  }
});

router.delete("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await db.query("DELETE FROM product_items WHERE id = ?", [id]);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete error", err });
  }
});


router.delete("/billing/:id", async (req, res) => {
  try {
    const billingId = req.params.id;

    const query = `
      UPDATE billing 
      SET is_deleted = 1 
      WHERE id = ?
    `;

    await db.query(query, [billingId]);

    res.json({ message: "Billing soft deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Delete error", error });
  }
});
module.exports = router;
