const EventEmitter = require("events");

const express = require("express");
const web = express();

var cors = require("cors");

const predict = require("./../inference");

let app = {};

class webEmitter extends EventEmitter {
  constructor() {
    super();

    web.listen(app.env.SERVER_PORT, function() {
      console.log(`App listening on port ${app.env.SERVER_PORT}!`);
    });
  }
}

web.use(cors());
web.use(express.json());
web.use(express.urlencoded({ extended: true }));

web.get("/api/pm25_data/list", (req, res) => {
  app.mongo.getPM25List(req.query, data => res.json(data));
});

web.get("/api/pm25_data/test", (req, res) => {
  app.mongo.getPM25Me(data => res.json(data));
});

web.get("/api/pm25_data/:device_id([0-9]*)", (req, res) => {
  app.mongo.getPM25Last(Number(req.params.device_id), data => res.json(data));
});

web.get("/api/track_data/list", (req, res) => {
  app.mongo.getTrackList(req.query, data => res.json(data));
});

web.get("/api/track_data/test", (req, res) => {
  app.mongo.getTrackMe(data => res.json(data));
});

web.get("/api/track_data/:sensor_id", (req, res) => {
  app.mongo.getTrackLast(req.params.sensor_id, data => res.json(data));
});

web.get("/api/predict", async (req, res) => {
  app.mongo.getRSSI(async data => {
    let maxTime = new Date(0);
    for (let i = 0; i < 4; i++) {
      if (data[i].ts > maxTime) maxTime = data[i].ts;
    }

    let cutTime = maxTime;
    cutTime.setMinutes(cutTime.getMinutes() - 3);

    let rssiOut = [90, 90, 90, 90];
    let groupOrder = ["tgr32", "tgr7", "tgr6", "tgr29"];

    for (let i = 0; i < 4; i++) {
      if (data[i].ts < cutTime) data[i].rssi = 90;
      else data[i].rssi = -data[i].rssi;
      if (groupOrder.indexOf(data[i]._id) != -1) {
        rssiOut[groupOrder.indexOf(data[i]._id)] = data[i].rssi;
      }
    }

    const ypred = await predict(rssiOut);
    const imax = ypred.indexOf(Math.max(...ypred)) + 1; // position of team;
    res.json(imax);
  });
});

web.get("/", function(req, res) {
  res.send("tgr32");
});

// catch 404 and forward to error handler
web.use((req, res) => {
  res.status(404);
  res.json({ error: "404 Not Found" });
});

// error handler
/* eslint no-unused-vars: ["error", { "args": "none" }] */
web.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = function(appIn) {
  app = appIn;
  return new webEmitter();
};
