const { ENUM } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const ForexBop = sequelize.define(
    "forex_bop",
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
      status: {
        type: DataTypes.ENUM("pending", "completed", "approved"),
        allowNull: false,
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Indian",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      physical_address_line1: DataTypes.STRING,
      physical_address_line2: DataTypes.STRING,
      physical_address_line3: DataTypes.STRING,
      suburb: DataTypes.STRING,
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postcode: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      residence_country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      residence_state: DataTypes.STRING,
      postal_address_line1: DataTypes.STRING,
      postal_address_line2: DataTypes.STRING,
      postal_address_line3: DataTypes.STRING,
      postal_suburb: DataTypes.STRING,
      postal_state: DataTypes.STRING,
      postal_city: {
        type: DataTypes.STRING,
        allowNull: false,
        //   defaultValue: "delhi",
      },
      postal_postcode: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postal_country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_details: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact_details: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: DataTypes.STRING,
      dob: DataTypes.STRING,
      benificiary_physical_address_line1: DataTypes.STRING,
      benificiary_physical_address_line2: DataTypes.STRING,
      benificiary_physical_address_line3: DataTypes.STRING,
      benificiary_suburb: DataTypes.STRING,
      benificiary_postcode: DataTypes.STRING,
      benificiary_country: DataTypes.STRING,
      benificiary_state: DataTypes.STRING,
      benificiary_name: DataTypes.STRING,
      benificiary_city: DataTypes.STRING,
      account_identifier: DataTypes.STRING,
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      sap_status: {
        type: DataTypes.STRING,
      },
      contact_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "forex_bop",
      timestamps: true,
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return ForexBop;
};
