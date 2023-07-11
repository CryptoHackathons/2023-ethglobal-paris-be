const express = require("express");
const basicAuth = require("express-basic-auth");

const { isEmpty } = require("./utils.js");

const app = express();
const port = 8080;

app.use(express.urlencoded()); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json()); // Parse JSON bodies (as sent by API clients)

app.get("/user/:address", async (request, response) => {
  const address = request.params.address;
  response.send(address);
});

app.post("/user/:address", async (request, response) => {
  const address = request.params.address;
  response.send(address);
});

app.get("/lotteries", async (request, response) => {
  const lotteries = [];
  response.send(lotteries);
});

app.get("/lottery/:lid", async (request, response) => {
  const lid = request.params.lid;
  response.send(lid);
});

app.post("/lottery", async (request, response) => {
  response.send("create lottery");
});

app.get("/lottery/:lid/:option(prizes|missions)", async (request, response) => {
  const lid = request.params.lid;
  const option = request.params.option;
  response.send(option);
});

app.post("/lottery/:lid/:option(prizes|missions)", async (request, response) => {
  const lid = request.params.lid;
  const option = request.params.option;
  response.send(option);
});

app.get("/lottery/:lid/close", async (request, response) => {
  const lid = request.params.lid;
  response.send(lid);
});

app.get("/lottery/:lid/redeem/:address", async (request, response) => {
  const lid = request.params.lid;
  const address = request.params.address;
  response.send(lid);
});



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
