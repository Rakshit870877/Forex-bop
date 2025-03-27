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

// router.post("/cancelReplaceTransaction", async (req, res) => {
//   try {
//     const { transaction_number } = req.body;

//     if (!transaction_number) {
//       return res.status(400).json({ error: "Transaction Number is required" });
//     }

//     // Find the existing transaction
//     const transaction = await db.forex_bop.findOne({
//       where: { transaction_number },
//     });

//     if (!transaction) {
//       return res.status(404).json({ error: "Transaction not found" });
//     }

//     const latestTransaction = await db.forex_bop.findOne({
//       where: { transaction_number },
//       order: [["transaction_attempt", "DESC"]], // Get the highest transaction_attempt
//     });

//     console.log(
//       latestTransaction.transaction_attempt + 1,
//       "=================>>>>123"
//     );

//     const newTransactionAttempt = latestTransaction.transaction_attempt + 1;
//     console.log(newTransactionAttempt, "------------------>>");

//     const newTransactionData = {
//       ...transaction.toJSON(),
//       transaction_attempt: newTransactionAttempt,
//       created_at: new Date(), // Ensure new timestamps
//       updated_at: new Date(),
//       postal_city: transaction.postal_city || "Unknown",
//       postal_postcode: transaction.postal_postcode || 000000,
//       postal_country: transaction.postal_country || "Unknown",
//       id_type: transaction.id_type || "Unknown",
//       id_details: transaction.id_details || "N/A",
//       contact_type: transaction.contact_type || "N/A",
//       contact_details: transaction.contact_details || "N/A",
//     };

//     // Remove `id` to avoid duplication
//     delete newTransactionData.id;
//     const result = await db.forex_bop_category.findAll({
//       where: { transaction_number },
//     });
//     console.log("==-------------->>>", result);
//     // Create a new row
//     const newTransaction = await db.forex_bop.create(newTransactionData);
//     const newCategory = {
//       ...result.toJSON(),
//       transaction_number: newTransactionAttempt,
//     };
//     const newCat = await db.forex_bop_category.create(newCategory);
//     res.status(201).json({
//       message: "New transaction created successfully",
//       newTransaction,
//       newCat,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
router.post("/cancelReplaceTransaction", async (req, res) => {
  try {
    const { newBopData, newbopCategoryData } = req.body;

    if (!newBopData.transaction_number) {
      return res.status(400).json({ error: "Transaction Number is required" });
    }

    // console.log(
    //   newBopData.latestTransaction.transaction_attempt,
    //   "========================>>>jschsvghswguc"
    // );
    // Find the existing transaction
    const transaction = await db.forex_bop.findOne({
      where: { transaction_number: newBopData.transaction_number },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Find the latest transaction attempt
    const latestTransaction = await db.forex_bop.findOne({
      where: { transaction_number: newBopData.transaction_number },
      order: [["transaction_attempt", "DESC"]],
    });
    // console.log(
    //   newBopData.latestTransaction.transaction_attempt,
    //   "========================>>>jschsvghswguc"
    // );

    const newTransactionAttempt = latestTransaction
      ? latestTransaction.transaction_attempt + 1
      : 1;

    // Create new transaction data
    const newTransactionData = {
      ...newBopData,
      transaction_attempt: newTransactionAttempt,
    };

    // Create a new transaction record
    const newTransaction = await db.forex_bop.create(newTransactionData);
    await db.forex_bop.update(
      {
        sap_status:
          latestTransaction.transaction_attempt - 1 ? "Cancelled" : "",
      },
      {
        where: {
          transaction_number: newBopData.transaction_number,
          transaction_attempt: latestTransaction.transaction_attempt,
        },
      }
    );

    // Find the latest category entry
    const latestCategory = await db.forex_bop_category.findOne({
      where: { transaction_number: newbopCategoryData.transaction_number },
      order: [["transaction_attempt", "DESC"]],
    });

    let newCategory = null;
    if (latestCategory) {
      const newCategoryData = {
        // ...latestCategory.toJSON(),
        ...newbopCategoryData,
        transaction_attempt: newTransactionAttempt,
        created_at: new Date(),
        updated_at: new Date(),
      };

      delete newCategoryData.id; // Remove ID to prevent duplication

      // Create a new category entry
      newCategory = await db.forex_bop_category.create(newCategoryData);
    }

    res.status(201).json({
      message: "New transaction and category entry created successfully",
      newTransaction,
      newCategory,
    });
  } catch (error) {
    console.error("Error in cancelReplaceTransaction:", error);
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
    const { transactionNumber, transectionAttempt } = req.params;

    if (!transactionNumber || transectionAttempt) {
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
