const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

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
  // bcrypt.compare(
  //   "agbadooo",
  //   "$2a$10$5iX45ZmX1pH95IsnNWky4uZV3Q/QXPalFmHKa735dHS.sdd7aVPy6",
  //   function (err, res) {
  //     console.log("first response", res);
  //   }
  // );
  // bcrypt.compare(
  //   "hamjad",
  //   "$2a$10$5iX45ZmX1pH95IsnNWky4uZV3Q/QXPalFmHKa735dHS.sdd7aVPy6",
  //   function (err, res) {
  //     console.log("second repsonse", res);
  //   }
  // );
  if (
    req.body.email === database.users[1].email &&
    req.body.password === database.users[1].password
  ) {
    res.json("success");
  } else {
    res.status(400).json("error 400 bad request signing in");
  }
});

//register route
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  // bcrypt.hash(password, null, null, function (err, hash) {
  //   console.log(hash);
  // });

  database.users.push({
    id: "15",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

//profile route
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;

  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json("not found");
  }
});

//link route
app.put("/link", (req, res) => {
  const { id } = req.body;
  let found = false;

  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json("not found");
  }
});

app.listen(3002, () => {
  console.log("the api is running on port 3002");
});

// // Load hash from your password DB.

// bcrypt.compare("veggies", hash, function (err, res) {
//   // res = false
// });
