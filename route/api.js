const express = require("express");
const router = express.Router();

router.route("/track_data/list").get(() => {});
router.route("/track_data/:sensor_id").get(() => {});

router.route("/pm25_data/list").get(() => {});
router.route("/pm25_data/:sensor_id").get(() => {});
