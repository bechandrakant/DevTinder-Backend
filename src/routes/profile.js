const express = require("express");
const bcrypt = require("bcrypt");
const userAuth = require("../middlewares/auth");
const { validateUpdateProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/view", userAuth, (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    validateUpdateProfileData(req);
    const loggedInUser = req.user; // attached by userAuth

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({ message: "User updated successfully", data: loggedInUser });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const loggedInUser = req.user; // attached by userAuth

    await loggedInUser.validatePassword(oldPassword);

    loggedInUser.password = await bcrypt.hash(newPassword, 10);

    await loggedInUser.save();
    res.json({ message: "Password updated successfully", data: loggedInUser });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
