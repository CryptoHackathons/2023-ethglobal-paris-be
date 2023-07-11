// @flow
const AuthUtils = require("./auth.js");
const { User } = require("./models");

async function queryUserByUsername(username) {
  const ret = await User.findAll({
    where: {
      username: username,
    },
  });
  return ret.length > 0 ? ret[0] : null;
}

async function queryAllUsers() {
  return await User.findAll({
    attributes: { exclude: ["password"] },
  });
}

async function createUserIfNotExists(username, password) {
  let user = await queryUserByUsername(username);
  if (user != null) {
    return null;
  }
  const _password = await AuthUtils.encryptPassword(password);
  user = await User.create({ username: username, password: _password });
  return user.id;
}

async function createUserOrUpdatePassword(username, password) {
  let user = await queryUserByUsername(username);
  const _password = await AuthUtils.encryptPassword(password);
  if (user != null) {
    user.password = _password;
    user.save();
    return user.id;
  }
  user = await User.create({ username: username, password: _password });
  return user.id;
}

module.exports = {
  queryUserByUsername,
  queryAllUsers,
  createUserIfNotExists,
  createUserOrUpdatePassword,
};
