const express = require("express");
const User = require("../models/User");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const userRouter = express.Router();

// GET /user/connections - all connection requests
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const connections = await ConnectionRequest.find({
      $or: [
        { from: req.user._id, status: "accepted" },
        { to: req.user._id, status: "accepted" },
      ],
    })
      .populate("from", ["name", "age"])
      .populate("to", ["name", "age"]);

    const data = connections.map((connection) => {
      if (connection.from._id.toString() === req.user.id.toString()) {
        return connection.to;
      }
      return connection.from;
    });

    res.send(data);
  } catch (err) {
    res.status(400).send("Bad request" + err.message);
  }
});

// GET /user/requests - get all pending requests
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const connections = await ConnectionRequest.find({
      to: req.user._id,
      status: "interested",
    }).populate("from", ["name", "age"]);

    res.send(connections);
  } catch (err) {
    res.status(400).send("Bad request" + err.message);
  }
});

// Gets you the profiles of other users on platform
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; // Sanitizing limit

    // get all connection where involved
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ from: loggedInUser.id }, { to: loggedInUser.id }],
    }).select("from to");

    let usersToHide = new Set();
    connectionRequests.forEach((request) => {
      usersToHide.add(request.from._id);
      usersToHide.add(request.to._id);
    });

    // All user except self
    const allUsers = await User.find({
      _id: { $nin: Array.from(usersToHide) },
    })
      .select("name age")
      .skip((page - 1) * limit)
      .limit(limit);

    res.send(allUsers);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// get user by id
userRouter.get("/user", async (req, res) => {
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
userRouter.get("/user", async (req, res) => {
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
userRouter.patch("/user", async (req, res) => {
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
userRouter.delete("/user", async (req, res) => {
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

module.exports = userRouter;
