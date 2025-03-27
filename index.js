const express = require("express");
const { db } = require("./models");
const bobRouter = require("./routes/bobRoutes");
const bopCategoryRouter = require("./routes/bopCategoryRoutes");
const cors = require("cors");
require("./utils/scheduler");
const { exportToExcel } = require("./utils/scheduler");
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("App is working!");
});

app.use("/bop", bobRouter);
app.use("/bopCategory", bopCategoryRouter);
app.get("/export", async (req, res) => {
  try {
    await exportToExcel();
    res.status(200).json({ message: "Excel file exported successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// console.log(
//   "hgshcshjcgjckscbhvgjskcnhcvjsjcxkshcvjdhcis",
//   db.forex_bop.findAll(),
//   "hgshcshjcgjckscbhvgjskcnhcvjsjcxkshcvjdhcis"
// );
db.sequelize
  .sync()
  .then(() => {
    console.log("✅ Database connected and synced.");
    const PORT = 9000;
    app.listen(PORT, () => {
      console.log("🚀 Server is running on port", PORT);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });
