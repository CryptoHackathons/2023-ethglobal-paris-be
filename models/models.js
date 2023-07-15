const { Sequelize, DataTypes } = require("sequelize");

if(process.env.NODE_ENV === 'production'){
  const sequelize = new Sequelize("postgres://amgtier:gzPNIBDkjkeJeuAs3Ant3gMW6FG9fASG@dpg-cip8jh6nqql4qa6jpaeg-a/ethp");
} else {
  const sequelize = new Sequelize("postgres://amgtier:gzPNIBDkjkeJeuAs3Ant3gMW6FG9fASG@dpg-cip8jh6nqql4qa6jpaeg-a.frankfurt-postgres.render.com/ethp?ssl=true");
}

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
