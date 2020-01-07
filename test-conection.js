var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://mongo.js:H7Jk9QjBwe24WvEhlS8fwTBIJZ8n0Z@19991999.xyz:27017/";

MongoClient.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  function(err, db) {
    if (err) {
      console.log("Connection to MongoDB error.");
      // throw err;
    }
    console.log("Connect to MongoDB successful.");
    db.close();
  }
);

var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://202.139.192.75");

client.on("connect", function() {
  console.log("Connect to MQTT successful.");
  client.end();
});
