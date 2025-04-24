const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const User = require("./models/User");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);

app.get("/feed", async (req, res) => {
  let users = await User.find({});
  res.send(users);
});

// get user by id
app.get("/user", async (req, res) => {
  try {
    let users = await User.find(req.body._id);
    if (users.length) {
      res.send(users);
    } else {
      res.status(404).send("user not found");
    }
  } catch (err) {
    res.status(400).send("Bad request" + err.message);
  }
});

// get user by email id
app.get("/user", async (req, res) => {
  try {
    let users = await User.find({ email: req.body.email });
    if (users.length) {
      res.send(users);
    } else {
      res.status(404).send("user not found");
    }
  } catch (err) {
    res.status(400).send("Bad request" + err.message);
  }
});

// update user
app.patch("/user", async (req, res) => {
  try {
    let user = await User.findOneAndUpdate(req.body.email, req.body, {
      runValidators: true,
      returnDocument: "after",
    });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("user not found");
    }
  } catch (err) {
    res.status(400).send("Bad request" + err.message);
  }
});

// delete user
app.delete("/user", async (req, res) => {
  try {
    let user = await User.findOneAndDelete(req.body.email, {
      returnDocument: "before",
    });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send("user not found");
    }
  } catch (err) {
    res.status(400).send("Bad request" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen(3000, () => {
      console.log("Server started");
    });
  })
  .catch(() => {
    console.log("Failed to connect to DB");
  });
