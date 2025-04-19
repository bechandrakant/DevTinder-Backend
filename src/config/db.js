const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/devTinder";

async function connectDB() {
  await mongoose.connect(uri);
}

module.exports = connectDB;
