const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { db } = require("../models");

const exportToExcel = async () => {
  try {
    const data = await db.BobTable.findAll();

    if (!data.length) {
      console.log("No data to export.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("BobTable Data");

    worksheet.columns = [
      { header: "Transaction Number", key: "transactionNumber", width: 15 },
      { header: "Transaction Attempt", key: "transactionAttempt", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Nationality", key: "Nationality", width: 15 },
      { header: "Name", key: "name", width: 15 },
      { header: "City", key: "City", width: 15 },
      { header: "Country", key: "Country", width: 15 },
      { header: "Postal City", key: "postalCity", width: 15 },
      { header: "Postal Country", key: "postalCountry", width: 15 },
      { header: "ID Type", key: "idType", width: 15 },
      { header: "Contact Details", key: "contactDetails", width: 20 },
      { header: "Age", key: "age", width: 10 },
    ];

    // Add rows to the worksheet
    data.forEach((item) => worksheet.addRow(item.dataValues));

    // Define file path
    const fileName = `BobTable_Data_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    const filePath = path.join(__dirname, "exports", fileName);

    // Ensure "exports" folder exists
    if (!fs.existsSync(path.join(__dirname, "exports"))) {
      fs.mkdirSync(path.join(__dirname, "exports"));
    }

    // Save the Excel file
    await workbook.xlsx.writeFile(filePath);

    console.log(`✅ Exported data to ${filePath}`);
  } catch (error) {
    console.error("❌ Error exporting to Excel:", error.message);
  }
};

// Schedule the job to run every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  console.log("📅 Running scheduled export...");
  await exportToExcel();
});

module.exports = { exportToExcel };
