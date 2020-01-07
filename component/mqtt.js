const EventEmitter = require("events");
const MQTT = require("mqtt");

let MQTTclient = MQTT.connect("mqtt://202.139.192.75", {
  clientId: "tgr32"
});

class mqttEmitter extends EventEmitter {
  constructor() {
    super();
  }
}

let mqtt = new mqttEmitter();

MQTTclient.on("connect", function() {
  console.log("Connect to MQTT successful.");
  MQTTclient.subscribe("tgr2020/+/data/#");
});

MQTTclient.on("message", function(topic, message) {
  topics = topic.toString().split("/");
  if (topics[0] == "tgr2020") {
    let msg = message.toString();
    try {
      let json = JSON.parse(msg);
      let obj = { ts: new Date(), sensor_type: topics[1], sensor_id: topics[3], data: json };
      mqtt.emit("newData", obj);
    } catch (e) {
      console.log("entering catch block");
      console.log(msg, e);
    }
  }
});

module.exports = mqtt;
