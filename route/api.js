const express = require("express");
const router = express.Router();

let app = {};

module.exports = appIn => {
  app = appIn;
  router.get("/", (req, res) => {
    res.send("hihi");
  });

  router.get("/track_data/list", () => {});
  router.get("/track_data/:sensor_id", () => {});

  router.get("/pm25_data/list", () => {});
  router.get("/pm25_data/:sensor_id", () => {});

  return router;
};
