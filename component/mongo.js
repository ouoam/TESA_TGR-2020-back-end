const EventEmitter = require("events");

const MongoClient = require("mongodb").MongoClient;

const model = {
  pm25: require("./../model/pm25")
};

let app = {};

class mongoEmitter extends EventEmitter {
  constructor() {
    super();
    this.db = {};
    this.dbo = {};

    let mongoEmitterThis = this;

    MongoClient.connect(
      app.env.MONGO_SERVER,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        auth: {
          user: app.env.MONGO_USER,
          password: app.env.MONGO_PASS
        }
      },
      function(err, db) {
        if (err) throw err;
        console.log("Connect to MongoDB successful.");
        mongoEmitterThis.db = db;
        mongoEmitterThis.dbo = db.db(app.env.MONGO_DB);
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

  getPM25List(query, cb) {
    let find = {};
    if (query.start) {
      if (!find.ts) find.ts = {};
      find.ts.$gte = new Date(query.start);
    }
    if (query.end) {
      if (!find.ts) find.ts = {};
      find.ts.$lte = new Date(query.end);
    }
    let re = this.dbo
      .collection("pm25_data2")
      .find(find)
      .sort({ ts: 1 });
    if (query.skip) re.skip(Number(query.skip));
    if (query.limit) re.limit(Number(query.limit));
    re.toArray(function(err, result) {
      if (err) throw err;
      cb(result || null);
    });
  }

  getPM25last(devID, cb) {
    this.dbo
      .collection("pm25_data2")
      .find({ id: devID })
      .sort({ ts: -1 })
      .limit(1)
      .toArray(function(err, result) {
        if (err) throw err;
        cb(result[0] || null);
      });
  }

  getPM25Me(cb) {
    this.getPM25last(32, cb);
  }
}

module.exports = appIn => {
  app = appIn;
  return new mongoEmitter();
};
