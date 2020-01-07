var express = require("express");
var app = express();

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://mongo.js:H7Jk9QjBwe24WvEhlS8fwTBIJZ8n0Z@19991999.xyz:27017/";

var mqtt = require("mqtt");
var MQTTclient = mqtt.connect("mqtt://202.139.192.75", {
  clientId: "tgr32"
});

var dbo = "";

app.use(express.json());

app.get("/", function(req, res) {
  res.send("tgr32");
});

app.listen(80, function() {
  console.log("Example app listening on port 80!");
});

MongoClient.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  function(err, db) {
    if (err) throw err;
    console.log("Connect to MongoDB successful.");
    dbo = db.db("tgr2020");
  }
);

MQTTclient.on("connect", function() {
  console.log("Connect to MQTT successful.");
  MQTTclient.subscribe("tgr2020/pm25/data/#");
});

MQTTclient.on("message", function(topic, message) {
  //  console.log(topic.toString() + " => " + message.toString());
  topics = topic.toString().split("/");
  if (topics[0] == "tgr2020") {
    try {
      let json = JSON.parse(message.toString());
      let obj = { ts: new Date(), sensor_type: topics[1], sensor_id: topics[3], data: json };
      if (dbo != "") {
        dbo.collection("raw_data").insertOne(obj, function(err, res) {
          if (err) throw err;
          console.log("Add success.", new Date());
        });
      } else {
        console.log("Not connect DB.");
      }
    } catch (e) {
      console.log("entering catch block");
      console.log(message.toString());
    }
  }
});
