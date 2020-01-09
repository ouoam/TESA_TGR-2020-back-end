const EventEmitter = require("events");

const MongoClient = require("mongodb").MongoClient;

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
      function(err, mongoclient) {
        if (err) throw err;
        console.log("Connect to MongoDB successful.");
        mongoEmitterThis.client = mongoclient;
        mongoEmitterThis.dbo = mongoclient.db(app.env.MONGO_DB);
        mongoEmitterThis.emit("connected");
      }
    );
  }

  addData(data) {
    if (this.client && this.client.isConnected()) {
      this.dbo.collection("raw_data" + app.env.MONGO_COLL).insertOne(data, function(err, res) {
        if (err) throw err;
        // console.log("Add raw success.", new Date());
      });
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
      .collection("pm25_data" + app.env.MONGO_COLL)
      .find(find)
      .sort({ ts: 1 });
    if (query.skip) re.skip(Number(query.skip));
    if (query.limit) re.limit(Number(query.limit));
    re.toArray(function(err, result) {
      if (err) throw err;
      cb(result || null);
    });
  }

  getPM25Last(devID, cb) {
    this.dbo
      .collection("pm25_data" + app.env.MONGO_COLL)
      .find({ device_id: devID })
      .sort({ ts: -1 })
      .limit(1)
      .toArray(function(err, result) {
        if (err) throw err;
        cb(result[0] || null);
      });
  }

  getPM25Me(cb) {
    this.getPM25Last(32, cb);
  }

  getTrackList(query, cb) {
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
      .collection("track_data" + app.env.MONGO_COLL)
      .find(find)
      .sort({ ts: 1 });
    if (query.skip) re.skip(Number(query.skip));
    if (query.limit) re.limit(Number(query.limit));
    re.toArray(function(err, result) {
      if (err) throw err;
      cb(result || null);
    });
  }

  getTrackLast(devID, cb) {
    this.dbo
      .collection("track_data" + app.env.MONGO_COLL)
      .find({ sensor_id: devID })
      .sort({ ts: -1 })
      .limit(1)
      .toArray(function(err, result) {
        if (err) throw err;
        cb(result[0] || null);
      });
  }

  getTrackMe(cb) {
    this.dbo
      .collection("track_data" + app.env.MONGO_COLL)
      .find({ mac_addr: "80:E1:26:07:D7:43", event_code: { $ne: null } })
      .sort({ ts: -1 })
      .limit(1)
      .toArray(function(err, result) {
        if (err) throw err;
        cb(result[0] || null);
      });
  }

  getRSSI(cb) {
    const db = app.mongo.dbo;
    db.collection("track_data" + app.env.MONGO_COLL)
      .aggregate([
        {
          $match: {
            mac_addr: "80:E1:26:07:D7:43"
          }
        },
        {
          $match: {
            $or: [{ sensor_id: "tgr6" }, { sensor_id: "tgr7" }, { sensor_id: "tgr29" }, { sensor_id: "tgr32" }]
          }
        },
        {
          $sort: {
            ts: -1
          }
        },
        {
          $group: {
            _id: "$sensor_id",
            rssi: { $first: "$rssi" },
            ts: { $first: "$ts" }
          }
        }
      ])
      .toArray(function(err, result) {
        cb(result);
      });
  }
}

module.exports = appIn => {
  app = appIn;
  return new mongoEmitter();
};
