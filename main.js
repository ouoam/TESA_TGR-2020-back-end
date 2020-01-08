const io = require("@pm2/io");

const reqMQTT = io.meter({
  name: "MQTT req/min",
  samples: 60
});

const result = require("dotenv").config();
if (result.error) {
  if (result.code == "ENOENT") {
    console.log("You don't have .env file!!");
  } else throw result.error;
}

let app = {
  mqtt: require("./component/mqtt.js")(result.parsed),
  web: require("./component/express.js")(result.parsed),
  mongo: require("./component/mongo.js")(result.parsed)
};

app.mqtt.on("newData", function(data) {
  reqMQTT.mark();
  app.mongo.addData(data);
});
