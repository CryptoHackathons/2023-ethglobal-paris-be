const express = require("express");
const { ethers } = require('ethers');
const { exec } = require('child_process');
const UserUtils = require("./user.js");
const LottUtils = require("./lottery.js");
const { isEmpty, makeSend } = require("./utils.js");
const fs = require('fs')
const {buildMimc7,buildBabyjub} = require('circomlibjs')
const mimcMerkle = require('./test/MiMCMerkle')
const crypto = require('crypto');

const app = express();

const WALLET_LENGTH = 42;

app.use(express.urlencoded()); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json()); // Parse JSON bodies (as sent by API clients)

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

app.post("/lottery", async (request, response) => {
  const { title, description, startTime, endTime, bannerURL } = request.body;
  if (isEmpty(title)) {
    response.status(400).send(makeSend("Empty title"));
    return;
  }
  const lottery = await LottUtils.createLottery(
    title,
    description,
    startTime,
    endTime,
    bannerURL
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
    const value = request.body.value;
    const lottery = await LottUtils.queryLotteryByID(lid);

    if (lottery == null) {
      response.sendStatus(404);
    } else {
      LottUtils.updateField(lottery, option, value);
      response.sendStatus(200);
    }
  }
);

app.get("/lottery/:lid/close", async (request, response) => {
  const lid = request.params.lid;
  response.send(makeSend(lid));
});

app.get("/lottery/:lid/redeem/:address", async (request, response) => {
  const lid = request.params.lid;
  const address = request.params.address;
  response.send(makeSend(lid));
});


// set time
function scheduleTask(time, task) {
  const currentTime = new Date().getTime();
  const targetTime = new Date(time).getTime();

  const delay = targetTime - currentTime;

  if (delay == 0) {
   
    task();
  } else {
    
    setTimeout(task, delay);
  }
}

function executeBash(){
  const bashScript = './compileZK.sh';
  exec(`bash ${bashScript}`, (error, stdout) => {
    if (error) {
      console.error('error:', error);
      return;
    }

    console.log('Success Compile!');
    console.log('Output:', stdout);
  })
}

const targetTimeTW = '2023-07-12T19:27:00+08:00'; // assign time for demo
const targetTime = new Date(targetTimeTW);
scheduleTask(targetTime, closeLottery);

module.exports = app;