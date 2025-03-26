const express = require("express");
const { db } = require("../models");
const router = express.Router();
const allowedStatuses = ["pending", "completed", "approved"];

router.post("/create", async (req, res) => {
  try {
    const bob = await db.forex_bop.create(req.body);
    res.status(201).json({ message: "Bop created successfully", bob });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const bobs = await db.forex_bop.findAll();
    res.status(200).json(bobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/updateBopStatus", async (req, res) => {
  try {
    const { transactionNumber, status } = req.body;

    if (!transactionNumber || !status) {
      return res
        .status(400)
        .json({ error: "transactionNumber and status are required" });
    }
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Allowed values: pending, completed, approved",
      });
    }

    const updated = await db.forex_bop.update(
      { status },
      { where: { transactionNumber } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/updateTransactionAttempt", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const transaction = await db.forex_bop.findByPk(id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    transaction.transactionAttempt += 1;
    await transaction.save();

    res.status(200).json({
      message: "Transaction attempt updated successfully",
      transactionAttempt: transaction.transactionAttempt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { ...updateFields } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const transaction = await db.forex_bop.findByPk(id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await transaction.update(updateFields);

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteBop", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const deleted = await db.forex_bop.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ error: "ID is required" });
//     }

//     const transaction = await db.forex_bop.findByPk(id);

//     if (!transaction) {
//       return res.status(404).json({ error: "Transaction not found" });
//     }

//     res.status(200).json({
//       message: "Transaction retrieved successfully",
//       data: transaction,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
router.get("/:transactionNumber", async (req, res) => {
  try {
    const { transactionNumber } = req.params;

    if (!transactionNumber) {
      return res.status(400).json({ error: "Transaction Number is required" });
    }

    const transaction = await db.forex_bop.findOne({
      where: { transaction_number: transactionNumber },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
