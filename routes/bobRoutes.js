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
    const { transaction_number, sap_status } = req.body;

    if (!transaction_number) {
      return res
        .status(400)
        .json({ error: "transactionNumber and status are required" });
    }
    // if (!allowedStatuses.includes(status)) {
    //   return res.status(400).json({
    //     error: "Invalid status. Allowed values: pending, completed, approved",
    //   });
    // }

    const updated = await db.forex_bop.update(
      { sap_status },
      { where: { transaction_number } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/cancelReplaceTransaction", async (req, res) => {
  try {
    const { newBopData, newbopCategoryData } = req.body;
    console.log(newBopData.transaction_number, "===============>>>araea");

    if (!newBopData.transaction_number) {
      return res.status(400).json({ error: "Transaction Number is required" });
    }

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

    const newTransactionAttempt = latestTransaction
      ? latestTransaction.transaction_attempt + 1
      : 1;

    // Create new transaction data
    // if (!newBopData.contact_details) {
    //   return res.status(400).json({ error: "contact_details is required" });
    // }
    const newTransactionData = {
      ...newBopData,
      transaction_attempt: newTransactionAttempt,
      contact_details: newBopData.contact_details || "something",
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

    const transaction = await db.forex_bop.findAll({
      where: { transaction_number: transactionNumber },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction retrieved successfully",
      data: transaction[transaction.length - 1],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.post("/release-bopdata", async (req, res) => {

//   try {
//     const { transaction_number, transaction_attempt, sap_status } = req.body;

//     if (!transaction_number) {
//       return res
//         .status(400)
//         .json({ error: "Transaction number is required" });
//     }
//     // if (!allowedStatuses.includes(status)) {
//     //   return res.status(400).json({
//     //     error: "Invalid status. Allowed values: pending, completed, approved",
//     //   });
//     // }
//     console.log(sap_status, transaction_attempt, transaction_number,"body")
//     const updated = await db.forex_bop.update(
//       { sap_status },
//       { where: { transaction_number, transaction_attempt } }
//     );
//     const bop_cd_data = {
//       transaction_number,
//       transaction_attempt,
//       reported_to_central_bank: 'No',
//       reserve_bank_status: 'Pending',
//       number_of_errors_central_bank: 0,
//       created_at: new Date(),
//       updated_at: new Date(),
//       reporting_date: new Date(),
//       response_received_date: new Date(),
//     }
//     console.log(updated,"updated")
//     const bob_cd = await db.forex_bop_cd.create(bop_cd_data);

//     res.status(200).json({ message: "Data released successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
router.post("/release-bopdata", async (req, res) => {
  try {
    const { transaction_number, transaction_attempt, sap_status } = req.body;

    // if (!transaction_number || !transaction_attempt) {
    //   return res
    //     .status(400)
    //     .json({ error: "Transaction number and attempt are required" });
    // }

    console.log(sap_status, transaction_attempt, transaction_number, "body");

    // Check if the record exists
    const existing = await db.forex_bop.findOne({
      where: { transaction_number, transaction_attempt },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ message: "No matching record found to update" });
    }

    const bop_cd_data = {
      transaction_number,
      transaction_attempt,
      reported_to_central_bank: "No",
      reserve_bank_status: "Pending",
      number_of_errors_central_bank: 0,
      created_at: new Date(),
      updated_at: new Date(),
      reporting_date: new Date(),
      response_received_date: new Date(),
    };
    const bob_cd = await db.forex_bop_cd.create(bop_cd_data);
    console.log(bob_cd, "bob_cd");
    // Update the existing record
    console.log(
      sap_status,
      "rakshit ------->>>>",
      transaction_number,
      transaction_attempt
    );
    // const [updatedCount] = await db.forex_bop.update(
    //   { sap_status,...existing.toJSON() },
    //   { where: { transaction_number, transaction_attempt } }
    // );
    await db.forex_bop.update(
      {
        sap_status: sap_status,
      },
      {
        where: {
          transaction_number: transaction_number,
          transaction_attempt: transaction_attempt,
        },
      }
    );

    // if (updatedCount === 0) {
    //   return res.status(500).json({ message: "Update failed" });
    // }

    // Create related CD data only if update succeeded

    res
      .status(200)
      .json({ message: "Data released and CD created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
