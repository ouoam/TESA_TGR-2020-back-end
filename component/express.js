const EventEmitter = require("events");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class webEmitter extends EventEmitter {
  constructor(env) {
    super();

    app.listen(env.SERVER_PORT, function() {
      console.log(`App listening on port ${env.SERVER_PORT}!`);
    });
  }
}

app.get("/", function(req, res) {
  res.send("tgr32");
});

module.exports = env => new webEmitter(env);
