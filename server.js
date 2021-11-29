const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const { config } = require("dotenv");
config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "success" });
});

app.post("/signin", (req, res) => signin.handleSignIn(req, res, db, bcrypt));
app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);
app.get("/profile/:id", (req, res) => profile.handleProfile(req, res, db));
app.put("/image", (req, res) => image.handleImage(req, res, db));
app.post("/imageUrl", (req, res) => image.handleApiCall(req, res));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});

/*

/ --> res = this is working

/signin --> POST = success / fail

/register --> POST = user

/profile/:userId --> GET = user

/image --> PUT = user



*/
