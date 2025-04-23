const jwt = require("jsonwebtoken");
const User = require("../models/User");

const privateKey = "DevTinder@20";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    const { id } = jwt.verify(token, privateKey);

    const user = await User.findById(id);
    if (!user) throw new Error("Invalid token");

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

module.exports = userAuth;
