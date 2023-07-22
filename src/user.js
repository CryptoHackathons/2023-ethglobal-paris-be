const { User } = require("./models");

async function queryUserByAddress(address) {
  const ret = await User.findAll({
    where: { address },
  });
  return ret.length > 0 ? ret[0] : null;
}

async function createUserIfNotExists(address) {
  let user = await queryUserByAddress(address);
  if (user == null) {
    user = await User.create({ address });
  }
  return user;
}

module.exports = {
  queryUserByAddress,
  createUserIfNotExists,
};
