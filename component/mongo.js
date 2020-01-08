const EventEmitter = require("events");

const MongoClient = require("mongodb").MongoClient;

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

  addData(coll, data) {
    if (this.db.isConnected()) {
      this.dbo.collection(coll).insertOne(data, function(err, res) {
        if (err) throw err;
        console.log("Add success.", new Date());
      });
    } else {
      console.log("Not connect DB.");
    }
  }
}

module.exports = env => new mongoEmitter(env);
