const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Test endpoint");
});

app.use("/hello", (req, res) => {
  res.send("hello endpoint");
});

app.use("/", (req, res) => {
  res.send("Default endpoint");
});

app.listen(3000, () => {
  console.log("Server started");
});
