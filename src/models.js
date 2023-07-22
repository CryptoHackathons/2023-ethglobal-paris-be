const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite:db.sqlite3:");
const User = sequelize.define("User", {
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

const Lottery = sequelize.define("Lottery", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.STRING,
  startTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  endTime: DataTypes.DATE,
  bannerURL: DataTypes.STRING,
  proof: DataTypes.STRING,
  prizes: DataTypes.STRING,
  missions: DataTypes.STRING,
});

module.exports = { User, Lottery };
