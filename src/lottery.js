const { Lottery } = require("../models/models");

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

module.exports = {
  queryLotteryByID,
  createLottery,
  queryAllLottery,
  updateField,
};
