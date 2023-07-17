const { Lottery, UserLotteryRecord, User } = require("../models/models");
const UserUtils = require("./user.js");

async function queryLotteryByID(id) {
  const ret = await Lottery.findAll({
    where: { id },
  });
  return ret.length > 0 ? ret[0] : null;
}

async function queryAllLottery(id) {
  const lotteries = await Lottery.findAll();
  return lotteries;
}

async function createLottery(
  title,
  description,
  startTime,
  endTime,
  bannerURL
) {
  const lottery = await Lottery.create({
    title,
    description,
    startTime,
    endTime,
    bannerURL,
  });
  return lottery;
}

async function updateField(lottery, fieldName, value) {
  lottery[fieldName] = value;
  await lottery.save();
}

async function registerUserLotteryRecord(lottery, user) {
  const record = await UserLotteryRecord.create({
    UserId: user.id, LotteryId: lottery.id
  });
  return record;
}

async function queryUserLotteryRecord(lottery, user) {
  const records = await UserLotteryRecord.findAll({
    where: { UserId: user.id, LotteryId: lottery.id }
  });
  console.log(records);
  return records.length > 0 ? records : null;
}

async function queryUserLotteryAllRecordsByUser(user) {
  const records = await UserLotteryRecord.findAll({
    where: { UserId: user.id },
    attributes: { exclude: ['UserId', 'updatedAt'] }
  }).then(async records => {
    const res = await Promise.all(records.map(async record => {
      let _record = { ...record.dataValues };
      const lid = _record.LotteryId;
      delete _record.LotteryId;
      _record['lottery'] = await queryLotteryByID(lid);
      return _record;
    }));
    return res;
  });
  return records;
}

async function queryUserLotteryAllRecordsByLottery(lottery) {
  const records = await UserLotteryRecord.findAll({
    where: { LotteryId: lottery.id },
    attributes: { exclude: ['LotteryId', 'updatedAt'] }
  }).then(async records => {
    const res = await Promise.all(records.map(async record => {
      let _record = { ...record.dataValues };
      const uid = _record.UserId;
      delete _record.UserId;
      _record['address'] = (await UserUtils.queryUserByID(uid)).address;
      console.log(_record)
      return _record;
    }));
    return res;
  });
  return records;
}

module.exports = {
  queryLotteryByID,
  createLottery,
  queryAllLottery,
  updateField,
  queryUserLotteryRecord,
  registerUserLotteryRecord,
  queryUserLotteryAllRecordsByUser,
  queryUserLotteryAllRecordsByLottery
};
