const express = require("express");
const { ethers } = require('ethers');
const { exec } = require('child_process');
var cors = require('cors');

const UserUtils = require("./user.js");
const LottUtils = require("./lottery.js");
const CloseUtils = require("./close.js");
const { isEmpty, makeSend } = require("./utils.js");
const fs = require('fs')
const { buildMimc7, buildBabyjub } = require('circomlibjs')
const mimcMerkle = require('./MiMCMerkle')
const crypto = require('crypto');

const app = express();

const WALLET_LENGTH = 42;
const PROOF_PATH = "./circuits/proof.json";

app.use(express.urlencoded()); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(cors());

app.get("/user/:address", async (request, response) => {
  const address = request.params.address;
  const user = await UserUtils.queryUserByAddress(address);
  if (user != null) {
    response.send(makeSend(user.id));
  } else {
    response.sendStatus(404);
  }
});

app.post("/user/:address", async (request, response) => {
  const address = request.params.address;
  // if (address.length != WALLET_LENGTH) {
  //   response.status(400).send("Invalid wallet");
  //   return;
  // }
  const user = await UserUtils.createUserIfNotExists(address);
  if (user != null) {
    response.send(makeSend(user.id));
  } else {
    response.sendStatus(500);
  }
});

app.get("/lotteries", async (request, response) => {
  const lotteries = await LottUtils.queryAllLottery();
  response.send(makeSend(lotteries));
});

app.get("/lottery/:lid", async (request, response) => {
  const lid = request.params.lid;
  const lottery = await LottUtils.queryLotteryByID(lid);
  if (lottery != null) {
    response.send(makeSend(lottery));
  } else {
    response.sendStatus(404);
  }
});

app.post("/lottery/:lid", async (request, response) => {
  const lid = request.params.lid;
  const lottery = await LottUtils.queryLotteryByID(lid);
  if (lottery != null) {
    const { title, description, startTime, endTime, bannerURL } = request.body;
    if (!isEmpty(title)) {
      lottery.title = title;
    }
    if (description != null) {
      lottery.description = description;
    }
    if (!isEmpty(startTime)) {
      lottery.startTime = startTime;
    }
    if (endTime != null) {
      lottery.endTime = endTime;
    }
    await lottery.save();
    response.sendStatus(200);;
  } else {
    response.sendStatus(404);
  }
});

app.post("/lottery", async (request, response) => {
  const { title, description, startTime, endTime, bannerURL } = request.body;
  if (isEmpty(title)) {
    response.status(400).send(makeSend("Empty title"));
    return;
  }
  const lottery = await LottUtils.createLottery(
    title,
    description ?? "",
    startTime,
    endTime ?? "",
    bannerURL ?? ""
  );
  response.send(makeSend(lottery.id));
});

app.get("/lottery/:lid/:option(prizes|missions)", async (request, response) => {
  const lid = request.params.lid;
  const option = request.params.option;
  const lottery = await LottUtils.queryLotteryByID(lid);
  response.send(makeSend(lottery[option]));
});

app.post(
  "/lottery/:lid/:option(prizes|missions)",
  async (request, response) => {
    const lid = request.params.lid;
    const option = request.params.option;
    const data = request.body.data;
    const lottery = await LottUtils.queryLotteryByID(lid);

    if (lottery == null) {
      response.sendStatus(404);
    } else {
      LottUtils.updateField(lottery, option, data);
      response.sendStatus(200);
    }
  }
);

app.get("/lottery/:lid/close", async (request, response) => {
  const lid = request.params.lid;
  await CloseUtils.closeLottery();
  response.send(makeSend(lid));
});

app.get("/lottery/:lid/redeem/:address", async (request, response) => {
  const lid = request.params.lid;
  const address = request.params.address;

  const lottery = await LottUtils.queryLotteryByID(lid);
  if (lottery == null) {
    response.status(404).send("Lottery Not Found");
    return;
  }
  const user = await UserUtils.queryUserByAddress(address);
  if (user == null) {
    response.status(404).send("Status Not Found");
    return;
  }
  if (!fs.existsSync(PROOF_PATH)) {
    response.sendStatus(204);
    return;
  }
  const proof = fs.readFileSync(PROOF_PATH);
  if (isEmpty(proof)) {
    response.sendStatus(204);
    return;
  }
  const obj = { lottery_id: lid, user_id: user.id, user_address: address, proof }
  response.send(makeSend(obj));
});

module.exports = app;