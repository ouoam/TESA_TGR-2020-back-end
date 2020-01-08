const EventEmitter = require("events");

const MongoClient = require("mongodb").MongoClient;

const model = {
  pm25: require("./../model/pm25")
};

class mongoEmitter extends EventEmitter {
  constructor(env) {
    super();
    this.db = {};
    this.dbo = {};

    let mongoEmitterThis = this;

    MongoClient.connect(
      env.MONGO_SERVER,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        auth: {
          user: env.MONGO_USER,
          password: env.MONGO_PASS
        }
      },
      function(err, db) {
        if (err) throw err;
        console.log("Connect to MongoDB successful.");
        mongoEmitterThis.db = db;
        mongoEmitterThis.dbo = db.db(env.MONGO_DB);
        mongoEmitterThis.emit("connected");
      }
    );
  }

  addData(data) {
    if (this.db.isConnected()) {
      this.dbo.collection("raw_data2").insertOne(data, function(err, res) {
        if (err) throw err;
        console.log("Add raw success.", new Date());
      });

      if (data.sensor_type == "pm25") {
        let value = model.pm25.validate(data.data);
        if (!value.error) {
          let sensorVal = Number.parseInt(value.value.DevEUI_uplink.payload_hex.substring(2, 4), 16);
          if (sensorVal != 191) {
            let data2 = {
              id: data.sensor_id,
              ts: data.ts,
              device_id: value.value.DevEUI_uplink.DevEUI,
              location: {
                lat: value.value.DevEUI_uplink.LrrLAT,
                lon: value.value.DevEUI_uplink.LrrLON
              },
              rssi: value.value.DevEUI_uplink.LrrRSSI,
              value: sensorVal
            };
            this.dbo.collection("pm25_data2").insertOne(data2, function(err, res) {
              if (err) throw err;
              console.log("Add success.", new Date());
            });
          } else {
            console.log("Sensor is error don't add.");
          }
        } else {
          console.log("Data validation error.");
        }
      }
    } else {
      console.log("Not connect DB.");
    }
  }
}

module.exports = env => new mongoEmitter(env);
