const EventEmitter = require("events");

const express = require("express");
const app = express();

let web = {};

web.emitter = new EventEmitter();

app.use(express.json());

app.get("/", function(req, res) {
  res.send("tgr32");
});

app.listen(80, function() {
  console.log("Example app listening on port 80!");
});

module.exports = web;
