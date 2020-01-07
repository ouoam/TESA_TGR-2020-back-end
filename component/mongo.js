const EventEmitter = require("events");

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://mongo.js:H7Jk9QjBwe24WvEhlS8fwTBIJZ8n0Z@19991999.xyz:27017/";

class mongoEmitter extends EventEmitter {
  constructor() {
    super();
    this.dbo = "";
  }

  addData(coll, data) {
    if (this.dbo != "") {
      this.dbo.collection(coll).insertOne(data, function(err, res) {
        if (err) throw err;
        console.log("Add success.", new Date());
      });
    } else {
      console.log("Not connect DB.");
    }
  }
}

let mongo = new mongoEmitter();

MongoClient.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  function(err, db) {
    if (err) throw err;
    console.log("Connect to MongoDB successful.");
    mongo.dbo = db.db("tgr2020");
    mongo.emit("connected");
  }
);

module.exports = mongo;
