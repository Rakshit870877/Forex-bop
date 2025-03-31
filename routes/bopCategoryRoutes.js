const express = require("express");
const router = express.Router();
const { db } = require("../models");

router.post("/", async (req, res) => {
  try {
    // await db.sequelize.sync({ alter: true });
    const newforex_bop_category = await db.forex_bop_category.create(req.body);
    res.status(201).json(newforex_bop_category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await db.forex_bop_category.findAll();
    // db.sequelize.sync({ alter: true });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.get("/:id", async (req, res) => {
//   try {
//     const category = await db.forex_bop_category.findByPk(req.params.id);
//     if (!category) {
//       return res.status(404).json({ message: "forex_bop_category not found" });
//     }
//     res.json(category);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.get("/:transactionNumber", async (req, res) => {
  try {
    const { transactionNumber } = req.params;

    if (!transactionNumber) {
      return res.status(400).json({ error: "Transaction number is required" });
    }

    const transaction = await db.forex_bop_category.findOne({
      where: { transaction_number: transactionNumber },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = await db.forex_bop_category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "forex_bop_category not found" });
    }
    await category.update(req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await db.forex_bop_category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "forex_bop_category not found" });
    }
    await category.destroy();
    res.json({ message: "forex_bop_category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
