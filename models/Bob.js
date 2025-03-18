module.exports = (sequelize, DataTypes) => {
  const Bob = sequelize.define("Bob", {
    transactionNumber: { type: DataTypes.INTEGER },
    transactionAttempt: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.STRING },
    Nationality: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    physicalAddressLine1: { type: DataTypes.STRING },
    physicalAddressLine2: { type: DataTypes.STRING },
    physicalAddressLine3: { type: DataTypes.STRING },
    Suburb: { type: DataTypes.STRING },
    City: { type: DataTypes.STRING },
    Postcode: { type: DataTypes.INTEGER },
    Country: { type: DataTypes.STRING },
    postalAddressLine1: { type: DataTypes.STRING },
    postalAddressLine2: { type: DataTypes.STRING },
    postalAddressLine3: { type: DataTypes.STRING },
    idType: { type: DataTypes.STRING },
    idDetails: { type: DataTypes.STRING },
    contactType: { type: DataTypes.STRING },
    contactDetails: { type: DataTypes.STRING },
  });

  return Bob;
};
