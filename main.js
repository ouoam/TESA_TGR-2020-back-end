const io = require("@pm2/io");

const reqsec = io.meter({
  name: "req/min",
  samples: 60
});

let app = {
  mqtt: require("./component/mqtt.js"),
  web: require("./component/express.js"),
  mongo: require("./component/mongo.js")
};

app.mqtt.on("newData", function(data) {
  reqsec.mark();
  app.mongo.addData("raw_data", data);
});
