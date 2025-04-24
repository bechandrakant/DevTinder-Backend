const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

const requestRouter = express.Router();

// status: interested, ignored
requestRouter.post("/send/:status/:userId", userAuth, async (req, res) => {
  try {
    const { status, userId } = req.params;
    const loggedInUser = req.user;

    if (!(status == "interested" || status == "ignored")) {
      throw new Error("Invalid status");
    }

    const isValidUserId = await User.findById(userId);

    if (!isValidUserId) {
      throw new Error("User not valid");
    }

    const existingConnectionRequest = await ConnectionRequest.find({
      $or: [
        {
          from: loggedInUser._id,
          to: userId,
        },
        {
          from: userId,
          to: loggedInUser._id,
        },
      ],
    });

    if (existingConnectionRequest) {
      throw new Error("Connection request already exist");
    }

    const request = new ConnectionRequest({
      from: loggedInUser._id,
      to: userId,
      status: status,
    });

    await request.save();
    res.send("connection request sent");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

requestRouter.patch(
  "/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      if (!(status == "accepted" || status == "rejected")) {
        throw new Error("Invalid status");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        to: loggedInUser.id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("No such requests");
      }

      connectionRequest.status = status;

      const data = await ConnectionRequest.save();
      res.status(200).json({ message: `Connection request ${status}`, data });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
