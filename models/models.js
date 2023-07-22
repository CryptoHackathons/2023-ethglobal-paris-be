const { Sequelize, DataTypes } = require("sequelize");

// const env = process.env.NODE_ENV || 'development';
// const config = require('../config/config.json')[env];
const sequelize = new Sequelize("postgres://amgtier:gzPNIBDkjkeJeuAs3Ant3gMW6FG9fASG@dpg-cip8jh6nqql4qa6jpaeg-a.frankfurt-postgres.render.com/ethp?ssl=true");
// const sequelize = new Sequelize(config.database, config.username, config.password, config);

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

if (require.main === module) {
  (async () => {
    await sequelize.sync();
  })();
}

module.exports = { User, Lottery };
