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

let app = {};

app.env = result.parsed;

app.mqtt = require("./component/mqtt.js")(app);
app.web = require("./component/express.js")(app);
app.mongo = require("./component/mongo.js")(app);
app.cleaning = require("./component/cleaning")(app);

app.mqtt.on("newData", function(data) {
  reqMQTT.mark();
  app.mongo.addData(data);
});
