var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://202.139.192.75");

client.on("connect", function() {
  console.log("MQTT Connected.");
  client.subscribe("tgr2020/pm2.5/data/");
});

client.on("message", function(topic, message) {
  console.log(topic.toString() + " => " + message.toString());
});
