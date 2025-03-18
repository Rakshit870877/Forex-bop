const express = require("express");
const db = require("../models");
// const { Bob } = db;
const Bob = db.Bob;

const bobRouter = express.Router();

bobRouter.post("/create", async (req, res) => {
  try {
    console.log(db.sequelize.Bob);
    console.log(Bob, "--------------");
    const newRecord = await db.sequelize.Bob.create(req.body);
    console.log(newRecord, "================");
    res.status(201).json({ status: "All Ok" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating record", details: error.message });
    console.log(error, "error--------------->>>>>>>>>>>>>");
  }
});

bobRouter.get("/all", async (req, res) => {
  try {
    const records = await Bob.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: "Error fetching records" });
  }
});

module.exports = bobRouter;
