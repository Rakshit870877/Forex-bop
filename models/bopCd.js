const { underscoredIf } = require("sequelize/lib/utils");

module.exports = (sequelize, DataTypes) => {
  const ForexBopCD = sequelize.define(
    "forex_bop_cd",
    {
      transaction_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transaction_attempt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reported_to_central_bank: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reserve_bank_status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reporting_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      response_received_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      number_of_errors_central_bank: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      error_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      error_description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      error_fixed: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    },
    {
      timestamps: false,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return ForexBopCD;
};
