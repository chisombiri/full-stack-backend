const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const { response } = require("express");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "postgres",
    database: "full-stack",
  },
});

db.select("*").from("users").then(console.log);

const app = express();

app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "12",
      name: "Nmesoma",
      email: "rocks@gmail.com",
      password: "cassava",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "13",
      name: "Hamjad",
      email: "ewa@gmail.com",
      password: "ewa",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "18",
      hash: "",
      email: "micheal@gmail.com",
    },
  ],
};

//root route
app.get("/", (req, res) => {
  res.send(database.users);
});

//signin route
app.post("/signin", (req, res) => {
  // const { email, password } = req.body;

  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      console.log(data[0]);
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((users) => {
            res.json(users[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("1 wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("2 wrong credentials"));
});

//register route
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((users) => {
            res.json(users[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));
});

//profile route
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("users")
    .where({
      id: id,
    })
    .then((users) => {
      //console.log(users);
      // res.json(users[0]);

      if (users.length) {
        res.json(users[0]);
      } else {
        res.status(400).json("no user found");
      }
    })
    .catch((err) => res.status(400).json("error getting users"));
});

//link route
app.put("/link", (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0]))
    .catch((err) => res.status(400).json("cannot get entries"));
});

app.listen(3012, () => {
  console.log("the api is running on port 3012");
});

// // Load hash from your password DB.

// bcrypt.compare("veggies", hash, function (err, res) {
//   // res = false
// });
