const express = require("express");
const basicAuth = require("express-basic-auth");

const { isEmpty } = require("./utils.js");
const AuthUtils = require("./auth.js");
const UserUtils = require("./user.js");

const app = express();
const port = 8080;
const basic_auth = basicAuth({
  authorizer: AuthUtils.authorizer,
  authorizeAsync: true,
});
// const { Sequelize } = require("sequelize");
// const sequelize = new Sequelize("sqlite:sqlite3.db:");
// require('./models.js')

app.use(express.urlencoded()); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json()); // Parse JSON bodies (as sent by API clients)

app.get("/", (req, response) => {
  response.send("404 Not Found?");
});

app.post("/", (req, response) => {
  response.send("You got to the right place, " + req.body.name);
});

app.use("/users", basic_auth);
app.get("/users", async (req, response) => {
  const users = await UserUtils.queryAllUsers();
  response.send("Users: " + JSON.stringify(users));
});

app.use("/user", basic_auth);
app.get("/user/:username", async (req, response) => {
  const username = req.params.username;
  response.send(await UserUtils.queryUserByUsername(username));
});

app.post("/user", async (req, response) => {
  const username = req.body.username;
  const password = req.body.password;
  if (isEmpty(username) || isEmpty(password)) {
    response
      .status(400)
      .send(`username: '${username}' or password: '${password}' is empty.`);
  } else if (req.body.action === "update_password") {
    const userID = await UserUtils.createUserOrUpdatePassword(
      username,
      password
    );
    response.send((userID ? userID : 0).toString());
    return;
  } else {
    const userID = await UserUtils.createUserIfNotExists(username, password);
    response.send((userID ? userID : 0).toString());
    return;
  }
  response.status(500).send();
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
