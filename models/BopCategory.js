const { underscoredIf } = require("sequelize/lib/utils");

module.exports = (sequelize, DataTypes) => {
  const ForexBopCategory = sequelize.define(
    "forex_bop_category",
    {
      transaction_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transaction_attempt: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      transaction_purpose: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bop_category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      excon_ruling_indicator: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "N",
      },
      excon_ruling_section: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sarb_internal_reference_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sarb_internal_reference_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      country_code: {
        type: DataTypes.STRING,
        allowNull: false,
        // defaultValue: "+91",
      },
      principal_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      settlement_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      principal_currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      settlement_currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adhoc_subject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subject_description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      bop_description: {
        type: DataTypes.STRING,
      },
      bop_sub_category: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return ForexBopCategory;
};
