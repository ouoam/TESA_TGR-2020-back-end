const EventEmitter = require("events");
const MQTT = require("mqtt");

class mqttEmitter extends EventEmitter {
  constructor(env) {
    super();

    let mqttEmitterThis = this;

    this.MQTTclient = {};

    this.MQTTclient = MQTT.connect(env.MQTT_SERVER, {
      clientId: env.MQTT_CLIENT
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
          let obj = { ts: new Date(), sensor_type: topics[1], sensor_id: topics[3], data: json };
          mqttEmitterThis.emit("newData", obj);
        } catch (e) {
          console.log("entering catch block");
          console.log(msg, e);
        }
      }
    });
  }
}

let mqtt = function(env) {
  return new mqttEmitter(env);
};

module.exports = mqtt;
