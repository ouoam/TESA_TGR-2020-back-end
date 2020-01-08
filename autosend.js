var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://202.139.192.75");

function ran(min, max) {
  return Math.random() * (max - min) + min;
}

client.on("connect", function() {
  console.log("MQTT Connected.");

  setInterval(function() {
    client.publish(
      `tgr2020/track/data/32`,
      `{
    "DevEUI_uplink": {
      "payload_hex": "204e",
      "LrrRSSI": "${ran(-120, -70).toFixed(5)}",
      "LrrSNR": "${ran(-2, 11).toFixed(5)}",
      "LrrLAT": "19.027611",
      "LrrLON": "99.891380"
    }
}`
    );
    console.log("Send", new Date());
  }, 5000);
});
