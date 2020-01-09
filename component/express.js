const EventEmitter = require("events");

const express = require("express");
const web = express();

let app = {};

class webEmitter extends EventEmitter {
  constructor() {
    super();

    web.listen(app.env.SERVER_PORT, function() {
      console.log(`App listening on port ${app.env.SERVER_PORT}!`);
    });
  }
}

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
