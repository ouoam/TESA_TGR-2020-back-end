const EventEmitter = require("events");
const MQTT = require("mqtt");

let app = {};

class mqttEmitter extends EventEmitter {
  constructor() {
    super();

    let mqttEmitterThis = this;

    this.MQTTclient = {};

    this.MQTTclient = MQTT.connect(app.env.MQTT_SERVER, {
      clientId: app.env.MQTT_CLIENT
    });

    this.MQTTclient.on("connect", function() {
      console.log("Connect to MQTT successful.");
      mqttEmitterThis.MQTTclient.subscribe("tgr2020-test/+/data/#");
    });

    this.MQTTclient.on("message", function(topic, message) {
      let topics = topic.toString().split("/");
      if (topics[0] == "tgr2020-test") {
        let msg = message.toString();
        try {
          let json = JSON.parse(msg);
          let obj = { ts: new Date(), sensor_type: topics[1], sensor_id: Number(topics[3]), data: json };
          mqttEmitterThis.emit("newData", obj);
        } catch (e) {
          console.log("entering catch block");
          console.log(msg, e);
        }
      }
    });
  }
}

module.exports = function(appIn) {
  app = appIn;
  return new mqttEmitter();
};
