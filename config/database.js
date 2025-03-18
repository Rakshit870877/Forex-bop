const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("bobTable", "rakshit", 12345, {
  host: "localhost", // Or your DB host
  dialect: "postgres",
  logging: false, // Disable logging for cleaner output
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
  }
})();

module.exports = sequelize;
