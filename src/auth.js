const bcrypt = require("bcrypt");
const salt = "$2b$10$nJWWA0VBEdtHSj4q4TTjD.";

const UserUtils = require("./user.js");

async function encryptPassword(password) {
  return await bcrypt.hash(password, salt).then((hash) => hash);
}

async function authorizer(username, password, callback) {
  const user = await UserUtils.queryUserByUsername(username);
  if(user == null){
    return callback(null, false);
  }
  console.log(user.password, await encryptPassword(password));
  if(user.password == await encryptPassword(password)){
    return callback(null, true);
  }
  return callback(null, false);
}

module.exports = { encryptPassword, authorizer };
