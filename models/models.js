const { Sequelize, DataTypes } = require("sequelize");

let sequelize;
if(process.env.NODE_ENV === 'production'){
  sequelize = new Sequelize("postgres://amgtier:gzPNIBDkjkeJeuAs3Ant3gMW6FG9fASG@dpg-cip8jh6nqql4qa6jpaeg-a/ethp");
} else {
  sequelize = new Sequelize("postgres://amgtier:gzPNIBDkjkeJeuAs3Ant3gMW6FG9fASG@dpg-cip8jh6nqql4qa6jpaeg-a.frankfurt-postgres.render.com/ethp?ssl=true");
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
    type: DataTypes.STRING(2048),
    allowNull: false,
  },
  description: DataTypes.STRING(65536),
  startTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  endTime: DataTypes.DATE,
  bannerURL: DataTypes.STRING(2048),
  proof: DataTypes.STRING,
  prizes: DataTypes.STRING(65536),
  missions: DataTypes.STRING(65536),
});

const UserLotteryRecord = sequelize.define('UserLotteryRecord', {});

User.belongsToMany(Lottery, {through: UserLotteryRecord});

if (require.main === module) {
  (async () => {
    await sequelize.sync({alter: true});
  })();
}

module.exports = { User, Lottery, UserLotteryRecord };
