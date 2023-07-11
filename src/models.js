const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite:sqlite3.db:");
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// (async () => {
//   await sequelize.sync({ force: true });
// })();

module.exports = { User };
